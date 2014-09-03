require 'sinatra'
require 'json'
require 'sinatra/cross_origin'

enable :cross_origin
get '/show' do
  user = {
    id: 1,
    name: "ryohei hoshi",
    age: 22
  }
  cross_origin
  user.to_json
end

post '/edit' do
  body = request.body.read

  if body == ''
    status 400
  else
    body.to_json
  end
end

