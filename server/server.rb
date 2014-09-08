# config:utf-8
require 'sinatra'
require 'sinatra/base'
require 'json'
require 'sinatra/cross_origin'

# load models
require_relative 'models/user'
require_relative 'models/event'
require_relative 'models/university'

class Server < Sinatra::Base
  use ActiveRecord::ConnectionAdapters::ConnectionManagement

  enable :cross_origin, :sessions
  set :session_secret, "My session secret"
end

get '/' do
  if session[:user_id]
    redirect "https://dl.dropboxusercontent.com/u/54211252/campuspace/front/html/all_eventpage.html"
  else
    redirect "https://dl.dropboxusercontent.com/u/54211252/campuspace/front/html/index.html?user_id=0"
  end
end

post '/sign_up' do
  # session[:user_id] ||= nil 
  # if session[:user_id]
  #   redirect '/log_out' #logout form
  # end 
  user = User.new
  user["name"] = params["name"]
  user["mail"] = params["mail"]
  user["sex"] = params["sex"]
  user["university_id"] = "1"
  passwords = user.encrypt_password(params["password"])
  user["password"] = passwords[0]
  user["password_salt"] = passwords[1]
  user["created_at"] = Time.now
  user["update_at"] = Time.now
  if user.save!
    session[:user_id] = user["user_id"]
    redirect "https://dl.dropboxusercontent.com/u/54211252/campuspace/front/html/all_eventpage.html"
  else
    redirect "https://dl.dropboxusercontent.com/u/54211252/campuspace/front/html/index.html"
  end
end 

post '/log_in' do
  if session[:user_id]
    redirect "https://dl.dropboxusercontent.com/u/54211252/campuspace/front/html/all_eventpage.html"
  end

  user = User.authenticate(params["mail"], params["password"])
  if user
    session[:user_id] = user["id"]
    p session[:user_id]
    redirect "https://dl.dropboxusercontent.com/u/54211252/campuspace/front/html/all_eventpage.html"
  else
    redirect "https://dl.dropboxusercontent.com/u/54211252/campuspace/front/html/index.html"
  end
end

get '/users.json' do
  users = User.all
  content_type :json, :charset => 'utf-8'
  cross_origin
  users.to_json
end

get '/getEvents.json' do
  events = []
  content_type :json, :charset => 'utf-8'
  eventtables = Event.select('id', 'name', 'content', 'deadline', 'category_num', 'admin_user_id')
  eventtables.each do |eventtable|
    user = User.find(eventtable["admin_user_id"])
    university = University.find(user["university_id"])
    event = {"id" => eventtable["id"], "name" => eventtable["name"], 
             "content" => eventtable["content"],
             "deadline" => eventtable["deadline"].strftime("%m月%d日 %H時%M分"),
             "category_num" => eventtable["category_num"],
             "user_name" => user["name"],
             "university_name" => university["name"],
             "university_image" => university["image"]
    }
    events.push(event)
  end
  cross_origin
  events.to_json
end

post '/newEvent' do
  new_event = []
  event = Event.new
  if params["title"].present?
    event["name"] = params["title"]
  else
    event["name"] = "test"
  end
  event["content"] = params["contents"]
  if params["deadline"].present?
    event["deadline"] = params["deadline"].to_datetime
  else
    event["deadline"] = Time.now + 1800
  end
  event["category_num"] = params["category"]
  event["admin_user_id"] = 1
  event["content"] = params["contents"]
  event["created_at"] = Time.now
  event["update_at"] = Time.now

  if event.save!
    cross_origin
    new_event.unshift("success")
  else
    cross_origin
    new_event.unshift("error")
  end
end

after do
  ActiveRecord::Base.connection.close
end
