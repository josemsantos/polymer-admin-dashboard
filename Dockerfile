FROM nginx:alpine
                               
COPY nginx_vhost.conf /etc/nginx/conf.d/default.conf
COPY build/dist /usr/share/nginx/html/

CMD ["nginx", "-g", "daemon off;"]
