# config:utf-8
require 'mysql2'
require 'active_record'
require 'sinatra'
require 'json'
require 'sinatra/cross_origin'

ActiveRecord::Base.configurations = YAML.load_file('config/database.yml')
ActiveRecord::Base.establish_connection(:development)

class User < ActiveRecord::Base
  belongs_to :university
  has_many :events
end

class Event < ActiveRecord::Base
  belongs_to :user
end

class University < ActiveRecord::Base
  has_many :users
end

enable :cross_origin
get '/users.json' do
  users = User.all
  content_type :json, :charset => 'utf-8'
  cross_origin
  users.to_json
end

enable :cross_origin
get '/getEvents.json' do
  events = []
  content_type :json, :charset => 'utf-8'
  eventtables = Event.select('id', 'name', 'content', 'deadline', 'user_id')
  eventtables.each do |eventtable|
    user = User.find(eventtable["user_id"])
    university = University.find(user["university_id"])
    event = {"id" => eventtable["id"], "name" => eventtable["name"], 
             "content" => eventtable["content"],
             "deadline" => eventtable["deadline"].strftime("%m月%d日 %H時%M分"),
             "user_name" => user["name"],
             "university_name" => university["name"],
             "university_image" => university["image"]
    }
    events.push(event)
  end
  cross_origin
  events.to_json
end

post '/edit' do
  body = request.body.read

  if body == ''
    status 400
  else
    body.to_json
  end
end

