require 'sinatra'
require 'json'

get '/show' do
  user = {
    id: 1,
    name: "ryohei hoshi",
    age: 22
  }
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

