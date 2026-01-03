#!/usr/bin/env node
import bcrypt from 'bcrypt';
import readline from 'readline';
import supabase from '../src/config/supabase.js';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const question = (q) => new Promise((res) => rl.question(q, res));

async function main() {
  try {
    const email = await question('Admin email: ');
    const password = await question('Admin password: ');
    rl.close();

    const hash = await bcrypt.hash(password, 10);
    const payload = { email, password_hash: hash, first_name: 'Admin', last_name: 'User', role: 'admin' };
    const { data, error } = await supabase.from('users').insert([payload]).select().maybeSingle();
    if (error) {
      console.error('Error creating admin user:', error);
      process.exit(1);
    }
    console.log('Admin user created:', data);

    // For admin users, create a corresponding school record
    const { data: schoolData, error: schoolError } = await supabase.from('schools').insert([{ 
      user_id: data.id, 
      school_name: 'System Admin', 
      address: 'System Administrator' 
    }]).select().maybeSingle();
    if (schoolError) {
      console.error('Failed to create admin school profile:', schoolError);
      process.exit(1);
    }
    else console.log('Admin school profile created:', schoolData);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
