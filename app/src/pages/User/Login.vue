<template>
    <main class="flex flex-col p-2 lg:p-20 __body" v-if="!AuthStatus">
        <div class="login_container">
            <div class="forms">
                <div class="form login">
                    <span class="title">User Login</span>

                    <div  v-if="error_msg" class="text-center break-words mt-5 -mb-1 font-semibold bg-red-100 rounded-lg py-5 px-6 mb-3 text-base text-red-700 inline-flex items-center w-full" role="alert">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times-circle" class="w-4 h-4 mr-2 fill-current" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"></path>
                        </svg>
                        {{error_msg}}
                    </div>

                    <form action="#">
                        <div class="input-field">
                            <label>
                                <input type="text" @click="resetError" v-bind:class="[error['username'] ? 'invalid_input' : '' ]" placeholder="Username" v-model="username" required>
                            </label>
                            <i class="uil uil-envelope icon"></i>
                        </div>

                        <div class="input-field">
                            <label>
                                <input @click="resetError" v-bind:type="[show_password ? 'text':'password']" v-bind:class="[error['password'] ? 'invalid_input password' : 'password' ]"
                                       placeholder="Password" v-model="password"
                                       required>
                            </label>
                            <i class="uil uil-lock icon"></i>
                            <i class="uil uil-eye-slash icon_r" v-if="!show_password" @click="pass_visibility()"></i>
                            <i class="uil uil-eye icon_r" v-if="show_password" @click="pass_visibility()"></i>
                        </div>

                        <div v-bind:class="[loading ? 'input-field button btn_bg' : 'input-field button']">
                            <input v-if="!loading" type="button" @click="login" value="Login">
                            <div v-if="loading" class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </main>
</template>

<script>

    import {mapGetters} from 'vuex';
    import axios from "axios";

    export default {
        name: "UserLogin",
        created: function(){
            if(this.AuthStatus){
                this.$router.push('/' + this.AuthType.toLowerCase() + "/home");
            }
        },
        methods: {
            pass_visibility: function () {
                this.show_password = !this.show_password;
            },
            reset: function () {
                this.username = null;
                this.password = null;
                this.error = {'username': '', 'password': ''};
                this.error_msg = "";
            },
            resetError : function(){
                this.error = {'username': '', 'password': ''};
            },
            login: async function () {
                this.loading = true;
                let data = {
                    'username': this.username,
                    'password': this.password,
                };
                let formData = new FormData();
                for (let key in data) {
                    formData.append(key, data[key]);
                }
                await axios(this.API + '/api/user/login', {
                    method: "post",
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "x-access-token": this.AuthToken
                    },
                    data: formData
                }).then((response) => {
                    // eslint-disable-next-line no-console
                    // console.log(response);
                    let res = response.data;
                    if (res.status === 200) {
                        let data = res.data;
                        let token = data['token'];
                        let type = data['type'];
                        this.$store.commit('setAuthStatus', true);
                        this.$store.commit('setAuthToken', token);
                        this.$store.commit('setAuthType', type);
                        this.$store.commit('setAuthUser', data);
                        localStorage.setItem('cookie', "");
                        localStorage.setItem('token', token);
                        this.reset();
                        this.$router.push('/' + type.toString().toLowerCase() + '/home');
                    }
                    else if(res.status === 400) {
                        let errors = res.data;
                        for(let index in errors){
                            this.error[index] = errors[index];
                        }
                    }
                    else{
                        this.error_msg = res.message;
                    }
                    this.loading = false;
                }).catch((error) => {
                    // eslint-disable-next-line no-console
                    // console.log(error);
                    if(error.response){
                        this.error_pit = error;
                        this.error_msg = "Internal Server Error! (" + error.response.status + ")";
                        this.$toast.error(this.error_msg);
                    }
                    else{
                        this.error_msg = "Network Error!";
                        // this.$toast.error("Network Error!");
                    }
                    this.loading = false;
                });
            }
        },
        computed: mapGetters({
            API: 'API',
            AuthToken: 'AuthToken',
            AuthStatus: 'AuthStatus',
            AuthType: 'AuthType',
        }),
        data() {
            return {
                show_password: false,
                loading: false,
                error_msg: "",
                username: '',
                password: '',
                error: {
                    username: '',
                    password: ''
                },
                error_pit: '',
            }
        }
    }
</script>

<style scoped>
    .__body {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgb(255 255 255);
    }

    .login_container {
        position: relative;
        max-width: 430px;
        width: 100%;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        border-radius: 12px;
        border: 1px solid #ffffff70;
    }

    .login_container .forms {
        width: 200%;
        display: flex;
        height: 440px;
        align-items: center;
        transition: height 0.4s ease;
    }

    .login_container .form {
        width: 50%;
        padding: 30px;
        border-radius: 12px;
        background: #fff;
        transition: margin-left 0.36s ease;
    }

    .login_container.active .login {
        margin-left: -50%;
        opacity: 0;
        transition: margin-left 0.36s ease, opacity 0.3s ease;
    }

    .login_container.active .forms {
        height: 600px;
    }

    .login_container .form .title {
        position: relative;
        font-size: 27px;
        font-weight: 600;
    }

    .form .title::before {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        height: 3px;
        width: 30px;
        background-color: #4070f4;
        border-radius: 25px;
    }

    .form .input-field {
        position: relative;
        height: 50px;
        width: 100%;
        margin-top: 30px;
    }

    .input-field input {
        height: 100%;
        width: 100%;
        padding: 0 35px;
        border: none;
        outline: none;
        font-size: 16px;
        border-bottom: 2px solid #ccc;
        border-top: 2px solid transparent;
        transition: border-bottom-color 0.4s ease;
    }

    .input-field input:is(:focus, :valid) {
        border-bottom-color: #4070f4;
    }

    .input-field i {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        color: #999;
        font-size: 23px;
        transition: color 0.4s ease;
    }

    .input-field input:is(:focus, :valid) ~ i {
        color: #4070f4;
    }

    .input-field i.icon {
        left: 0;
    }

    .input-field i.icon_r {
        right: 0;
    }

    .input-field i.showHidePw {
        right: 0;
        cursor: pointer;
        padding: 10px;
    }

    .form .checkbox-text {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }

    .checkbox-text .checkbox-content {
        display: flex;
        align-items: center;
    }

    .checkbox-content input {
        margin: 0 8px -2px 4px;
        accent-color: #4070f4;
    }

    .form .text {
        color: #333;
        font-size: 14px;
    }

    .form a.text {
        color: #4070f4;
        text-decoration: none;
    }

    .form a {
        text-decoration: none;
    }

    .form a:hover {
        text-decoration: underline;
    }

    .form .button {
        margin-top: 35px;
    }

    .form .button input, .btn_bg {
        border: none;
        color: #000;
        font-size: 18px;
        font-weight: 500;
        letter-spacing: 1px;
        border-radius: 6px;
        background-color: rgb(252, 213, 53);
        cursor: pointer;
        transition: all 0.6s ease;
    }
    .btn_bg{
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }

    .button input:hover {
        background-color: rgb(227, 193, 49);
    }

    .error_message{
        height: 20px !important;
    }

    .invalid_input{
        border-bottom-color: #f40503 !important;
    }
</style>