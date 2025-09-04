const { createClient } = require('@supabase/supabase-js')

// Читаем переменные окружения из .env файла
const fs = require('fs')
const path = require('path')

let supabaseUrl = ''
let supabaseAnonKey = ''

try {
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8')
  const lines = envContent.split('\n')
  
  for (const line of lines) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim()
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseAnonKey = line.split('=')[1].trim()
    }
  }
} catch (error) {
  console.log('❌ Could not read .env file:', error.message)
}

console.log('🔍 Testing Supabase Connection...')
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
console.log('Anon Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing')

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Missing environment variables!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    // Test 1: Check if we can connect
    console.log('\n📡 Testing basic connection...')
    const { data, error } = await supabase.from('messages').select('count').limit(1)
    
    if (error) {
      console.log('❌ Connection error:', error.message)
      return false
    }
    
    console.log('✅ Basic connection successful')
    
    // Test 2: Check tables
    console.log('\n📊 Checking tables...')
    
    const tables = ['messages', 'canvas_objects', 'projects', 'users']
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('count').limit(1)
        if (error) {
          console.log(`❌ Table ${table}: ${error.message}`)
        } else {
          console.log(`✅ Table ${table}: exists`)
        }
      } catch (err) {
        console.log(`❌ Table ${table}: ${err.message}`)
      }
    }
    
    return true
    
  } catch (error) {
    console.log('❌ Test failed:', error.message)
    return false
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n🎉 Supabase connection test completed!')
  } else {
    console.log('\n💥 Supabase connection test failed!')
  }
})
