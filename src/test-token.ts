import { AEPService } from './services/aep.service';

async function testGetAccessToken() {
  const aepService = new AEPService();
  try {
    // Access the private method using any type assertion
    const token = await (aepService as any).getAccessToken();
    console.log('Access Token:', token);
  } catch (error: any) {
    console.error('Error getting access token:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testGetAccessToken(); 