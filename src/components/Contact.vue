<template>

  <div class="flex items-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto">
      <div class="max-w-md mx-auto my-10 bg-white p-5 rounded-md shadow-sm">
        <div class="text-center" style="margin-bottom: 50px;">
          <h1
              class="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200"
          >
            Contact Us
          </h1>
          <p class="text-gray-400 dark:text-gray-400">
            Fill the form below to send HoneyDo a personalized message!
          </p>
        </div>
        <div class="m-7">
          <form action="https://api.web3forms.com/submit" method="POST" id="form">
            <input type="hidden" name="access_key" value="2c8cc905-bb93-41ae-8dce-b70948d4f297"/>
            <input
                type="hidden"
                name="subject"
                value="New Submission from HoneyDo"
            />
            <input
                type="hidden"
                name="redirect"
                value="https://web3forms.com/success"
            />
            <input type="checkbox" name="botcheck" class= "hidden" id="botcheck" style="display: none;"/>
            <div class="mb-6" style="margin-bottom: 50px;">
              <label
                  for="name"
                  class="block mb-2 text-sm text-gray-600 dark:text-gray-400"
              >Full Name:</label>
              <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter a name..."
                  required
                  class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              />
            </div>
            <div class="mb-6" style="margin-bottom: 50px;">
              <label
                  for="email"
                  class="block mb-2 text-sm text-gray-600 dark:text-gray-400"
              >Email Address:</label>
              <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="example@domain.com"
                  required
                  class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              />
            </div>
            <div class="mb-6" style="margin-bottom: 50px;">
              <label for="phone" class="text-sm text-gray-600 dark:text-gray-400"
              >Phone Number (optional):</label>
              <input
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="+1 (123) 456-7890"
                  class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              />
            </div>
             <label for="subject" class="text-sm text-gray-600 dark:text-gray-400" style="margin-bottom: 50px;"
              >Subject:</label>
            <input type="text"  id="subject" placeholder= "Enter any topic" name="subject" required/>
            <div class="mb-6" style="margin-bottom: 50px;">
              <label
                  for="message"
                  class="block mb-2 text-sm text-gray-600 dark:text-gray-400"
              ></label>

              <textarea
                  rows="10"
                  cols="50"
                  name="message"
                  id="message"
                  placeholder="Your Unique Message..."
                  class="w-full px-5 py-5 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                  required
              ></textarea>
            </div>
            <div class="mb-6" style="margin-bottom: 50px;">
              <button
                  type="submit"
                  class="w-full px-3 py-4 text-black bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none">
                Send Form
              </button>
            </div>
            <p class="text-base text-center text-blue-400" id="result"></p>
          </form>
        </div>
      </div>
    </div>
  </div>

</template>