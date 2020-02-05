require 'test_helper'
require 'parser/current'

module Foreman
  class CheckDeprecationWarning < ::Parser::AST::Processor
    attr_accessor :versions_found

    def initialize(file)
      super()
      @file = file
      @versions_found = []
    end

    def on_begin(node)
      node.children.each { |c| process(c) }
    end

    def on_send(node)
      method_class, method_name, *args = node.children
      if method_name == :api_deprecation_warning
        *method_classes = method_class.children if method_class && method_class.children
        if method_classes.include?(:Deprecation)
          puts "#{method_name} at #{@file} on line #{node.loc.line}"
          args.select! do |arg|
            arg.type == :float || arg.to_s =~ /^\d+\.\d+$/
          end
          if args.any?
            @versions_found << {
              version: args.first.children.first.to_f,
              file: @file,
              line: node.loc.line
            }
          end
        end
      end
    end
  end

  class DeprecationWarningRemovalTest < ActiveSupport::TestCase
    def test_deprecations_have_been_removed
      root_path = File.expand_path File.join(File.dirname(__FILE__), '..', '..')
      foreman_version = IO.binread(File.join(root_path, "VERSION"))
      

      Dir.glob(File.join(root_path, "app/**/*.rb")).select do |file|
        ast = ::Parser::CurrentRuby.parse(File.read(file))
        processor = CheckDeprecationWarning.new(file)
        processor.process(ast)

        if processor.versions_found.any?
          processor.versions_found.each do |version_found|
            msg = "Deprecation warning at #{version_found[:file]} line #{version_found[:line]} is marked for 
                  removal in version #{version_found[:version]}, which is less than or equal to the current Foreman 
                  version of #{foreman_version}."
            assert(Gem::Version.new(foreman_version) <= Gem::Version.new(version_found[:version]) , msg)
          end
        end
      end
    end
  end
end