import supabase from './src/supabaseClient.js'

async function testConnection() {
  const { data, error } = await supabase.from('students').select('*')

  if (error) {
    console.error('Supabase error:', error.message)
  } else {
    console.log('Supabase connected. Data:', data)
  }
}

testConnection()
