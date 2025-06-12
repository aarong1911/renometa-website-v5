const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { user_request_id, name, email, phone, preferred_time, notes } = JSON.parse(event.body);

    const { error } = await supabase.from('agent_appointments').insert({
      user_request_id,
      name,
      email,
      phone,
      preferred_time,
      notes,
    });

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Appointment request submitted successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Booking failed' }),
    };
  }
};

exports.config = {
  timeout: 26,
};
