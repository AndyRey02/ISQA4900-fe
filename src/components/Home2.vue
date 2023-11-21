<template>
    <div>
        <!--      <img src="@/assets/HoneyDoLogo.jpg" alt="HoneyDo Logo" />   -->

        <!-- Description -->
        <p></p>

        <h2>{{ description }}</h2>
        <p>
            <br><br>
        </p>

        <!-- Advantages Section -->
        <div class="image-container">

            <div class="advantages">

                <!-- Advantage 1 -->
                <div class="advantage">
                    <p class="text-above" style="font-size: 25px; font-weight: bold;">Recurring Reminders</p>
                    <div class="circle">
                        <img src="@/assets/recurring.jpg" alt="Recurring Reminders" />
                    </div>
                    <p class="text-below"><strong>When did I change the furnace filter?</strong><br>
                        Keep trak of daily, weekly, monthly, quarterly tasks.</p>
                </div>

                <!-- Advantage 2 -->
                <div class="advantage">
                    <p class="text-above" style="font-size: 25px; font-weight: bold;">Ad-hoc Reminders</p>
                    <div class="circle"><img src="@/assets/adhoc.jpg" alt="Ad-hoc Reminders" />
                    </div>
                    <p><strong>Winter is here and I didn't paint the shed!?</strong>!<br>
                        Set reminders for tasks to complete.</p>
                </div>
                <div class="advantage">
                </div>

            </div>
        </div>

        <br><br>

        <!-- Advantages Section2 -->
        <div class="advantages">

            <!-- Advantage 3 -->
            <div class="advantage">
                <p class="text-above" style="font-size: 25px; font-weight: bold;">Daily Tasks</p>
                <div class="circle"><img src="@/assets/daily.jpg" alt="Daily Tasks" /></div>
                <strong>Do these kids even know we have a dishwasher?</strong><br>
                Assign daily chores to kids (or spouses)
            </div>

        </div>

        <br><br>

        <!-- Signup/Learn More Section -->
        <div>
            <button type="button" class="btn btn-dark btn-lg my-2" v-if="!authenticated" @click="register">
                <router-link :to="{ name: 'Register' }">Sign Up</router-link></button>
            <button type="button" class="btn btn-clear btn-sm"></button>
            <button type="button" class="btn btn-outline-dark btn-lg" @click="scrollToTemplates">Templates</button>
        </div>

        <br><br>

        <!-- Offerings Section -->

        <div class="bubble-container">
            <!-- Offering 1 -->
            <a href="/viewGroups">
                <div class="bubble bubble1">
                    <img src="@/assets/group.jpg" alt="Work Groups" class="bubble-image" />
                    <p @click="viewGroups" class="bubble-text"><strong>Work Groups</strong></p>
                </div>
            </a>

            <!-- Offering 2 -->
            <a href="/viewList">
                <div class="bubble bubble2">
                    <img src="@/assets/list.jpg" alt="Project Lists" class="bubble-image" />
                    <p class="bubble-text"><strong>Project Lists</strong></p>
                </div>
            </a>

            <!-- Offering 3 -->
            <a href="/viewTask">
                <div class="bubble bubble3">
                    <img src="@/assets/tasks.jpg" alt="ToDo Items" class="bubble-image" />
                    <p class="bubble-text"><strong>ToDo Items</strong></p>
                </div>
            </a>
        </div>

        <br><br>


        <!-- Template Section -->
        <div id="templates">
            <h1>Templates</h1>
            <p></p>
            <div>
                <strong>Sample Project or Task Lists to get you Started</strong>
                <p>Use one of our templates or create your own.</p>

                <div class="container-fluid">
                    <div class="row align-items-center justify-content-center">
                        <div class="col col-12 col-sm-10 col-md-10">
                            <div class="card-group">
                                <div class="card">
                                    <h5 class="card-title">Grocery List</h5>
                                    <img :src="require('@/assets/grocerylist.jpg')" class="card-img-top"
                                        style="height: 15rem">
                                    <div class="card-body">
                                        <a @click="viewGroups" class="btn btn-primary">Groceries</a>
                                    </div>
                                </div>
                                <div class="card">
                                    <h5 class="card-title">Chore Lists</h5>
                                    <img :src="require('@/assets/chorelist.jpg')" class="card-img-top"
                                        style="height: 15rem">
                                    <div class="card-body">
                                        <a @click="viewList" class="btn btn-primary">Chores</a>
                                    </div>
                                </div>
                                <div class="card">
                                    <h5 class="card-title">Outdoor Projects</h5>
                                    <img :src="require('@/assets/outdoorchores.jpg')" class="card-img-top"
                                        style="height: 15rem">
                                    <div class="card-body">
                                        <a @click="viewTasks" class="btn btn-primary">Outdoor Projects</a>
                                    </div>
                                </div>
                                <div class="card">
                                    <h5 class="card-title">Household Cleaning</h5>
                                    <img :src="require('@/assets/cleaninglist.jpg')" class="card-img-top"
                                        style="height: 15rem">
                                    <div class="card-body">
                                        <a @click="viewTasks" class="btn btn-primary">Cleaning</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            description: "Never lose track of lists for yourself or chores for your family ever again!",
        };
    },


    methods: {
        scrollToTemplates() {
            const bookmarkElement = document.getElementById('templates');
            if (bookmarkElement) {
                bookmarkElement.scrollIntoView({ behavior: 'smooth' });
            }
        },
    },
};
</script>  
  
<style scoped>
/* Add styles here */
.advantages {
    display: flex;
    justify-content: space-around;
    font-size: medium;
}

.advantage {
    text-align: center;
}

.circle {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    overflow: hidden;
    margin: -20px;
}

.circle img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 50%;
    image-orientation: center;
}

.text-above,
.text-below {
    margin-bottom: -10px;
    text-align: center;
}

.bubble-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 600px;
}

.bubble {
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    overflow: hidden;
    text-align: center;
}

.bubble1 {
    background-color: #ffcc00;
    top: 0;
    left: 200px;
}

.bubble2 {
    background-color: #66ccff;
    top: 225px;
    left: 400px;
}

.bubble3 {
    background-color: #ff6666;
    top: 0px;
    left: 600px;
}

.bubble-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.bubble-text {
    margin-top: -85px;
    font: bold;
    font-family: cursive;
    font-size: xx-large;
    color: rgb(8, 104, 41);
}
</style>