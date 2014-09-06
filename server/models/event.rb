require 'mysql2'
require 'active_record'

ActiveRecord::Base.configurations = YAML.load_file('config/database.yml')
ActiveRecord::Base.establish_connection(:development)

class Event < ActiveRecord::Base
  belongs_to :user
end
