#!/usr/bin/env ruby

require 'xcodeproj'
require 'tempfile'
require 'fileutils'

Dir.chdir('ios')

@podfile_path = Pathname.pwd + 'Podfile'
@pod_dep = "  pod 'Stripe', '~> 16.0.0'\n"

@project_paths= Pathname.pwd.children.select { |pn| pn.extname == '.xcodeproj' }
raise 'No Xcode project found' unless @project_paths.length > 0
raise 'Multiple Xcode projects found' unless @project_paths.length == 1
project_path = @project_paths.first

project = Xcodeproj::Project.open(project_path)
main_target = project.targets.first

puts "Checking Podfile in iOS project #{@podfile_path}"


if File.exist? @podfile_path
  puts 'Found an existing Podfile'
  puts "Adding the following pod to Podfile\n#{@pod_dep}"
  temp_file = Tempfile.new('Podfile_temp')
  begin
    escaped_target_name = main_target.name.gsub(/'/, "\\\\\'")
    File.readlines(@podfile_path).each do |line|
      if line =~ /pod\s'Stripe'/
        puts 'Stripe pod is already added'
        exit
      end
    temp_file.puts(line)
      unless line =~ /^\s*(\#{0})use_frameworks!/
        temp_file.puts(@pod_dep) if line =~ /target\s+'#{escaped_target_name}'\s+do/
      else
        puts 'Your project using use_frameworks! directive, please check README and issue https://github.com/tipsi/tipsi-stripe/issues/29'
      end
    end
    temp_file.close
    FileUtils.mv(temp_file.path, @podfile_path)
  ensure
    temp_file.delete
  end
else
  puts 'Adding Podfile to iOS project'
  podfile = ''

  podfile << "# Uncomment the next line to define a global platform for your project\n# platform :ios, '9.0'\n"
  podfile << "\ntarget '#{main_target.name.gsub(/'/, "\\\\\'")}' do\n"
  podfile << @pod_dep
  podfile << "  inherit! :search_paths\n"
  podfile << "end\n"
  puts podfile
  File.write(@podfile_path, podfile)
end

puts 'Installing Pods'

system 'pod install'
