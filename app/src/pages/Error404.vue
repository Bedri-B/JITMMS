<template>
    <div class="mx-5 my-5">
        <section class="page_404">
            <div class="container mx-auto">
                <div class="row">
                    <div class="col-sm-12 ">
                        <div class="col-sm-10 col-sm-offset-1  text-center">
                            <div class="four_zero_four_bg">
                                <h1 class="text-center ">404</h1>

                            </div>

                            <div class="contant_box_404">
                                <h3 class="h2">
                                    Looks like you're lost
                                </h3>

                                <p>The page you are looking for is not available!</p>

                                <RouterLink :to="path" class="link_404">Go to Home</RouterLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    export default {
        name: "error404",
        created: function(){
          if(this.$store.getters.AuthStatus){
              this.path = "/" + this.$store.getters.AuthType.toString().toLowerCase() +  "/home";
          }
        },
        data(){
            return {
                path: "/"
            }
        }
    }
</script>

<style scoped>
    /*======================
        404 page
    =======================*/

    .page_404 {
        padding: 40px 0;
        background: #fff;
        font-family: "Arvo", serif;
    }

    .page_404 img {
        width: 100%;
    }

    .four_zero_four_bg {
        background-image: url('../assets/img/404.gif');
        height: 400px;
        background-position: center;
    }

    .four_zero_four_bg h1 {
        font-size: 80px;
    }

    .four_zero_four_bg h3 {
        font-size: 80px;
    }

    .link_404 {
        color: #fff !important;
        padding: 10px 20px;
        background: #39ac31;
        margin: 20px 0;
        display: inline-block;
    }
    .contant_box_404 {
        margin-top: -50px;
    }

</style>