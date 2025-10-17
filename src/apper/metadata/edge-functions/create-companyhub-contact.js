import apper from 'https://cdn.apper.io/actions/apper-actions.js';

apper.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Method not allowed. Only POST requests are supported.'
      }),
      { 
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: firstName, lastName, and email are required'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get CompanyHub API key from secrets
    const apiKey = await apper.getSecret('COMPANYHUB_API_KEY');
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'CompanyHub API key not configured'
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Prepare contact data for CompanyHub
    const contactData = {
      name: `${body.firstName} ${body.lastName}`,
      email: body.email,
      phone: body.phone || '',
      customFields: {
        gradeLevel: body.gradeLevel || '',
        class: body.class || '',
        status: body.status || 'Active',
        parentContactName: body.parentContact?.name || '',
        parentContactPhone: body.parentContact?.phone || '',
        parentContactEmail: body.parentContact?.email || ''
      }
    };

    // Make API call to CompanyHub
    const response = await fetch('https://api.companyhub.com/v1/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      return new Response(
        JSON.stringify({
          success: false,
          error: `CompanyHub API error: ${response.status} ${response.statusText}`,
          details: errorData
        }),
        { 
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const result = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        message: 'Contact created successfully in CompanyHub'
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: error.message
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});