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
        <div className="flex flex-col max-w-md mx-auto space-y-2 md:space-y-0 md:flex-row">
          <input
            type="email"
            name="EMAIL"
            className="w-full p-2 bg-black border border-zinc-800 rounded md:rounded-l md:rounded-r-none focus:outline-none focus:border-[#D4FF99]"
            id="mce-EMAIL"
            placeholder="Enter your email"
            required
          />
          <button 
            type="submit"
            name="subscribe"
            id="mc-embedded-subscribe"
            className="w-full md:w-auto px-6 py-2 bg-[#D4FF99] hover:bg-[#bfe589] text-black font-medium rounded md:rounded-r md:rounded-l-none transition duration-300"
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
