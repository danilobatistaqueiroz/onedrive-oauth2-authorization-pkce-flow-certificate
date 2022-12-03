# Como configurar a aplicação para usar OAuth2:  
https://learn.microsoft.com/en-us/onedrive/developer/rest-api/getting-started/msa-oauth?view=odsp-graph-online

# Como configurar os end-points para o OAuth2:  
https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow

# Portal Azure, para configurar Apps:  
https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade


https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Credentials/appId/5ca13223-4cf7-4bf3-9ba9-a8b7fe9ccdd6/isMSAApp~/true



##### Gerar o Certificado e o JWT
//é necessário gerar um certificado e aplicar no azure app registrations  
//no azure app registration, configurar a url de retorno, o tipo de app que pode ser desktop, mobile, web, spa  
//configurar para aceitar pkce  

//gerar um encrypted private key  
`openssl genrsa -des3 -passout pass:x -out keypair.key 2048`
//gerar uma private key  
`openssl rsa -passin pass:x -in keypair.key -out ./private.key`  
//gerar o certificado  
`openssl req -newkey rsa:4096  -x509  -sha512  -days 365 -nodes -out certificate.pem -keyout privatekey.pem`  
//imprimir a public key  
`openssl x509 -pubkey -noout -in certificate.pem`  

##### Verificar se está usando a Private Key correta
//Run the following command to view the modulus of the certificate.  
`openssl x509 -noout -modulus -in server.crt | openssl md5`  
//Now you will receive the modulus something like a77c7953ea5283056a0c9ad75b274b96  
//Run the following command to view the modulus of the private key.  
`openssl rsa -noout -modulus -in myserver.key | openssl md5`  
//Now you should get the modulus as same as certificate modulus above. i.e a77c7953ea5283056a0c9ad75b274b96  

##### Pegar o figerprint do certificado e gerar o claim x5t para o JWT
`openssl x509 -fingerprint -in certificates/certificate.pem -noout`  
//SHA1 Fingerprint=53:D7:03:93:B1:FC:09:05:98:08:47:34:58:C9:E2:85:85:B7:1F:8D  
//remover os :
`let x5t = safeBase64EncodedThumbprint('53D70393B1FC09059808473458C9E28585B71F8D')`  
