#! /bin/bash
source /etc/profile
cd /Users/ness/Documents/fit-main
npm unpublish gfit@1.0.1
npm publish 
git add . 
git commit -m 'd'
git push
