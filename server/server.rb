# config:utf-8
require 'mysql2'
require 'active_record'
require 'sinatra'
require 'json'
require 'sinatra/cross_origin'

ActiveRecord::Base.configurations = YAML.load_file('config/database.yml')
ActiveRecord::Base.establish_connection(:development)

class User < ActiveRecord::Base
end

class Event < ActiveRecord::Base
end

enable :cross_origin
get '/users.json' do
  content_type :json, :charset => 'utf-8'
  users = User.all
  cross_origin
  users.to_json
end

get '/getEvents.json' do
  content_type :json, :charset => 'utf-8'
  events = Event.all
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

