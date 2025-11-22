const { z } = require('zod');

const UserUpdateDto = z.object({
    firstName: z.string("First name is required!").nonempty("First name is required!"),
    lastName: z.string("Last name is required!").nonempty("Last name is required!"),
    username: z.string("Username is required!").nonempty("Username is required!"),
    email: z.email("Email must be valid!").nonempty("Email is required!"),
    password: z.string("Password is required!").nonempty("Password is required!"),
});

const AdminUserUpdateDto = z.object({
    firstName: z.string("First name is required!").nonempty("First name is required!"),
    lastName: z.string("Last name is required!").nonempty("Last name is required!"),
    username: z.string("Username is required!").nonempty("Username is required!"),
    email: z.email("Email must be valid!").nonempty("Email is required!"),
    password: z.string("Password is required!").nonempty("Password is required!"),
    role: z.string("Role is required!").nonempty("Role is required!"),
});

const LoginDto = z.object({
    username: z.string("Username is required!").nonempty("Username is required!"),
    password: z.string("Password is required!").nonempty("Password is required!"),
});

const UserDto = z.object({
    firstName: z.string(),
    lastName: z.string(),
    username: z.string(),
    email: z.string(),
    role: z.string(),
})

module.exports = { UserUpdateDto, AdminUserUpdateDto, UserDto, LoginDto };