create table users (
    id serial primary key,
    firstname varchar(50) not null,
    lastname varchar(50) not null,
    email varchar(254) unique not null
);

create table login (
    id serial primary key,
    username varchar(25) unique not null,
    password text not null
);

create table stats (
    id serial primary key,
    user_id int references users(id),
    wins int,
    losses int,
    draws int,
    points int
);