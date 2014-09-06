require 'mysql2'
require 'active_record'
require 'bcrypt'

ActiveRecord::Base.configurations = YAML.load_file('config/database.yml')
ActiveRecord::Base.establish_connection(:development)

class User < ActiveRecord::Base
  include BCrypt
  belongs_to :university
  has_many :events

  def self.authenticate(mail, password)
    user = self.where(mail: mail).first
    if user && user["password"] == BCrypt::Engine.hash_secret(password, user["password_salt"])
      user
    else
      nil 
    end 
  end
  
  def encrypt_password(password)
    if password.present?
      @password_salt = BCrypt::Engine.generate_salt
      @password_hash = BCrypt::Engine.hash_secret(password, @password_salt)
      return @password_hash, @password_salt
    end
  end
end

