select firstname, lastname, email, username from users
join login on users.id = login.id
where users.id = ${id}