#!/usr/bin/env ruby

require 'xcodeproj'
require 'tempfile'
require 'fileutils'

Dir.chdir('ios')

@podfile_path = Pathname.pwd + 'Podfile'
@pod_dep = "  pod 'Stripe', '~> 10.1.0'\n"

@project_paths= Pathname.pwd.children.select { |pn| pn.extname == '.xcodeproj' }
raise 'No Xcode project found' unless @project_paths.length > 0
raise 'Multiple Xcode projects found' unless @project_paths.length == 1
project_path = @project_paths.first

project = Xcodeproj::Project.open(project_path)
project_name = File.basename(project_path, '.xcodeproj')
main_target = project.targets.first

if File.exist? @podfile_path
  puts "\n\n"
  puts '=============================================================================='
  puts ' TIPSI-STRIPE                                                                 '
  puts ' [iOS] Make sure, that you configured your Podfile correctly!                 '
  puts '                                                                              '
  puts ' Checkout Migration Guide:                                                    '
  puts " https://tipsi.gitbooks.io/tipsi-stripe/content/migration-guides/374-380.html "
  puts '=============================================================================='
  puts "\n\n"
else
  puts "Adding Podfile to iOS project:\n\n"
  podfile = ''
  podfile << "platform :ios, '10.0'\n\n"
  podfile << "workspace '#{project_name}'\n\n"
  podfile << "target '#{main_target.name.gsub(/'/, "\\\\\'")}' do\n"
  podfile << @pod_dep
  podfile << "end\n\n"
  podfile << "target 'TPSStripe' do\n"
  podfile << "  project '../node_modules/tipsi-stripe/ios/TPSStripe'\n"
  podfile << @pod_dep
  podfile << "end\n"
  puts podfile
  puts "\n"
  File.write(@podfile_path, podfile)
end

puts "Sync dependencies:\n\n"
system 'pod install'
