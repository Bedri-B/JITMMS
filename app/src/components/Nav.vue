<template>
    <nav class="c-nav bg-white" :class="{ 'is-closed': isClosed }">
        <div class="c-nav__header md:justify-end ">
            <button @click="close" class="focus:outline-none text-slate-900">
                <svg v-if="!isClosed" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>

                <svg v-if="isClosed" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                </svg>
            </button>
        </div>
        <div class="c-nav__menu flex flex-col justify-between" :class="[ mode === 'mobile' ? 'is-mobile' : '' ]">
            <ul class="bg-white">
                <li class="c-nav__menuitem" v-for="item in menuListItem" :key="item.id">
                    <router-link :to="item.url"
                                 :class="{'active': item.isActive}"
                                 class="flex place-items-center py-4 px-6 text-gray-1 hover:border-l-3 hover:border-solid hover:border-primary-normal hover:bg-primary-light hover:text-primary-normal">
                        <i style="font-size: 1.5rem;" v-bind:class="[item.icon]"></i>
                        <span class="ml-3">{{ item.title }}</span>
                    </router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>

    export default {
        name: 'Nav',
        components: { },
        props: {
            mode: String,
            menuListItem: Array,
            user: Object,
        },
        methods:{
          close: function(){
              this.isClosed = !this.isClosed;
          }
        },
        data () {
            return {
                isClosed: false,
                personName: this.user.firstName + ' ' + this.user.lastName
            }
        }
    }
</script>

<style>

    .s24{
        width: 24px;
        height: 24px;
    }
    .c-nav {
        grid-area: nav;
        width: 215px;
        transition: width .25s cubic-bezier(0.4,0.0,0.2,1);
        overflow: hidden;
    }
    .c-nav.is-closed { width: 80px; }

    .c-nav__header {
        padding: 28px;
        display: flex;
        justify-content: left
    }

    .c-nav__user {
        height: 100px;
        padding: 30px
    }

    .c-nav__menu.is-mobile {
        position: absolute;
        top: 80px;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #FFF;
        z-index: 10000;
        transition: opacity .15s ease, transform .3s ease;
        opacity: 1;
        transform: translateX(0);
    }
    .c-nav.is-closed .c-nav__menu.is-mobile {
        opacity: 0;
        transform: translateX(-100%);
    }
    .c-nav__menuitem a {
        width: 100%;
        transition: border .10s linear,
                    width .25s cubic-bezier(0.4,0.0,0.2,1),
                    background-color .25s cubic-bezier(0.4,0.0,0.2,1),
                    color .25s cubic-bezier(0.4,0.0,0.2,1);
    }
    .c-nav__menuitem a svg {
        width: 24px;
        height: 24px;
    }
    .c-nav .c-nav__menuitem a span { transition: visibility .10s .25s cubic-bezier(0.4,0.0,0.2,1); }
    .c-nav.is-closed .c-nav__menuitem a span {
        visibility: hidden;
        transition: visibility .25s cubic-bezier(0.4,0.0,0.2,1);
    }

    /* Actve state */
    .c-nav__menuitem a.is-active {
        @apply  border-l-3 border-solid border-primary-normal bg-primary-light text-primary-normal;
    }

    @media (min-width: 768px) {
        .c-nav__menuitem a { width: 215px; }
    }
</style>