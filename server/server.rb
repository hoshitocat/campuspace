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
  user = User.new
  mail = params["mail"]
  mail = mail.split("@")[1]
  university_id = University.where(domain: mail)["id"]

  if params["image"]
    image_path = "../public/image/#{params["image"][:filename]}"
  
    File.open(image_path, 'wb') do |f|
      f.write params["image"][:tempfile].read
    end
    user["image"] = image_path
  end

  session[:user_id] ||= nil 
  if session[:user_id]
    redirect '/log_out' #logout form
  end 
  user["name"] = params["name"]
  user["mail"] = params["mail"]
  user["sex"] = params["sex"]
  user["university_id"] = university_id
  passwords = user.encrypt_password(params["password"])
  user["password"] = passwords[0]
  user["password_salt"] = passwords[1]
  user["created_at"] = Time.now
  user["update_at"] = Time.now
  if user.save!
    session[:user_id] = user["user_id"]
    redirect "https://dl.dropboxusercontent.com/u/54211252/campuspace/front/html/all_eventpage.html?id=#{user["id"]}"
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
    redirect "https://dl.dropboxusercontent.com/u/54211252/campuspace/front/html/all_eventpage.html?id=#{user["id"]}"
  else
    redirect "https://dl.dropboxusercontent.com/u/54211252/campuspace/front/html/index.html"
  end
end

get '/user.json' do
  user = User.find(params["id"])
  university = University.find(user["university_id"])
  user_info = {"name" => user["name"], "university" => university["name"], "university_image" => university["image"]}
  content_type :json, :charset => 'utf-8'
  cross_origin
  user_info.to_json
end

get '/getEvents.json' do
  content_type :json, :charset => 'utf-8'
  events = []
  match_events = []

  user_id = params["id"].to_i
  if (params["university_id"])
  else
    user_university_id = User.select('university_id').find(user_id)
    user_university_id = user_university_id["university_id"]
    university_name = University.find(user_university_id)["name"]
    university_image = University.find(user_university_id)["image"]
  end

  event_datas = Event.all.select('id', 'name', 'content', 'deadline', 'category_num', 'admin_user_id')
  event_datas.each do |event_data|
    if (User.find(event_data["admin_user_id"])["university_id"] == user_university_id)
      match_events.push(event_data)
    end
  end

  match_events.each do |match_event|
    admin_user_name = User.find(match_event["admin_user_id"])["name"]
    event = {"id" => match_event["id"], "name" => match_event["name"],
             "content" => match_event["content"],
             "deadline" => match_event["deadline"].strftime("%m月%d日 %H時%M分"),
             "category_num" => match_event["category_num"],
             "user_name" => admin_user_name,
             "university_name" => university_name,
             "university_image" => university_image
    }
    events.push(event)
  end
  cross_origin
  events.to_json
end

post '/newEvent' do
  images_name = Dir.glob("public/image/*")
  images_path = []
  images_name.each do |image|
    images_path << image.gsub("public/", "./")
  end

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
  event["admin_user_id"] = params["id"]
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

get '/getUniversities.json' do
  content_type :json, :charset => 'utf-8'

  universities = []
  universities_info = University.all.select("id", "name", "image");
  universities_info.each do |info|
    university = {"id" => info["id"],
             "name" => info["name"],
             "image" => info["image"]}
    universities.push(university)
  end

  cross_origin
  universities.to_json
end

after do
  ActiveRecord::Base.connection.close
end
