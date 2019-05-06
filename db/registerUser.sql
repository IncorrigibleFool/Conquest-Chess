insert into users(firstname, lastname, email)
values(
    ${firstname},
    ${lastname},
    ${email}
);

insert into stats(wins, losses, draws, points)
values(0,0,0,0);

insert into login(username, password)
values(
    ${username},
    ${hash}
)returning id;