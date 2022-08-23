if (test-path "C:\Program Files (x86)\Nodejs") { rm -r -fo "C:\Program Files (x86)\Nodejs" }
if (test-path "C:\Program Files\Nodejs") { rm -r -fo "C:\Program Files\Nodejs" }
$u = "chris"
if (test-path "C:\Users\$u\AppData\Roaming\npm") { rm -r -fo "C:\Users\$u\AppData\Roaming\npm" }
if (test-path "C:\Users\$u\AppData\Roaming\npm-cache") { rm -r -fo "C:\Users\$u\AppData\Roaming\npm-cache" }
if (test-path "C:\Users\$u\.npmrc") { rm -r -fo "C:\Users\$u\.npmrc" }
if (test-path "C:\Users\$u\npmrc") { rm -r -fo "C:\Users\$u\npmrc" }
if (test-path "C:\Users\$u\npmrc") { rm -r -fo "C:\Users\$u\npmrc" }

# rm -r -fo C:\Users\chris\AppData\Local\Temp\npm-*