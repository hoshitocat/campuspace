require 'mysql2'
require 'active_record'

ActiveRecord::Base.configurations = YAML.load_file('config/database.yml')
ActiveRecord::Base.establish_connection(:development)

class User < ActiveRecord::Base
  belongs_to :university
  has_many :events
end
