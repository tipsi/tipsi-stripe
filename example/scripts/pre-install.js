#!/usr/bin/env node
const path = require('path')
const { execSync } = require('child_process')
const { name, version } = require('../../package.json')

const rootDirectory = path.join(__dirname, '../..')

// 1. Remove all *.tgz before install
execSync('rm -rf *.tgz', { cwd: rootDirectory })

// 2. Do npm pack
execSync('npm pack', { cwd: rootDirectory })
