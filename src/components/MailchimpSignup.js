import React from 'react';

const MailchimpEmbedded = () => {
  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
      <form
        action="https://northernnationalmusic.us17.list-manage.com/subscribe/post?u=22d3f967aaa29a31ccd2275a1&amp;id=7e228c82dc&amp;f_id=0048c2e1f0"
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        className="validate"
        target="_blank"
      >
        <h3 className="text-xl font-bold mb-4">JOIN OUR MAILING LIST</h3>
        <div className="flex flex-col max-w-md mx-auto gap-2 sm:flex-row sm:gap-0">
          <input
            type="email"
            name="EMAIL"
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg sm:rounded-r-none focus:outline-none focus:border-red-500"
            id="mce-EMAIL"
            placeholder="Enter your email"
            required
          />
          <button 
            type="submit"
            name="subscribe"
            id="mc-embedded-subscribe"
            className="w-full sm:w-auto px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg sm:rounded-l-none transition duration-300"
          >
            SUBSCRIBE
          </button>
        </div>
        {/* Bot protection - don't remove */}
        <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
          <input type="text" name="b_22d3f967aaa29a31ccd2275a1_7e228c82dc" tabIndex="-1" value="" />
        </div>
      </form>
    </div>
  );
};

export { MailchimpEmbedded };
