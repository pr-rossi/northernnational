import React, { useState } from 'react';

// Embedded Form Version
const MailchimpEmbedded = () => {
  return (
    <div id="mc_embed_signup" className="bg-gray-800 p-8 rounded-lg shadow-lg">
      <form
        action="YOUR_MAILCHIMP_FORM_URL_HERE" // Replace with your Mailchimp form URL
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        className="validate"
        target="_blank"
      >
        <h3 className="text-xl font-bold mb-4">JOIN OUR MAILING LIST</h3>
        <div className="flex max-w-md mx-auto">
          <input
            type="email"
            name="EMAIL"
            className="flex-1 p-2 bg-gray-900 border border-gray-700 rounded-l focus:outline-none focus:border-red-500"
            id="mce-EMAIL"
            placeholder="Enter your email"
            required
          />
          <button 
            type="submit"
            name="subscribe"
            className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-r transition duration-300"
          >
            SUBSCRIBE
          </button>
        </div>
        {/* Bot protection - don't remove */}
        <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
          <input type="text" name="b_YOUR_FORM_ID" tabIndex="-1" value="" />
        </div>
      </form>
    </div>
  );
};

// API Version
const MailchimpAPI = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmail('');
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">JOIN OUR MAILING LIST</h3>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="flex max-w-md w-full mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 p-2 bg-gray-900 border border-gray-700 rounded-l focus:outline-none focus:border-red-500"
            required
          />
          <button 
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-r transition duration-300 disabled:opacity-50"
          >
            {loading ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
          </button>
        </div>
        {status === 'success' && (
          <p className="mt-4 text-green-500">Thanks for subscribing!</p>
        )}
        {status === 'error' && (
          <p className="mt-4 text-red-500">Something went wrong. Please try again.</p>
        )}
      </form>
    </div>
  );
};

export { MailchimpEmbedded, MailchimpAPI };
