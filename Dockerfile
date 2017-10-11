FROM nginx:alpine
                               
COPY build/dist /usr/share/nginx/html/

CMD ["nginx", "-g", "daemon off;"]
