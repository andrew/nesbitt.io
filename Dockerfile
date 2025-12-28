FROM ruby:4.0.0-alpine

RUN apk add --no-cache build-base git libffi-dev

WORKDIR /site

COPY Gemfile Gemfile.lock ./
RUN bundle install --jobs 4

COPY . .

EXPOSE 4000

CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0"]
