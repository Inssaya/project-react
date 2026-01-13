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
    const firstName = await question('First name (default: Admin): ') || 'Admin';
    const lastName = await question('Last name (default: User): ') || 'User';
    rl.close();

    const hash = await bcrypt.hash(password, 10);
    const payload = { email, password_hash: hash, first_name: firstName, last_name: lastName, role: 'admin' };
    const { data, error } = await supabase.from('users').insert([payload]).select().maybeSingle();
    if (error) {
      console.error('Error creating admin user:', error);
      process.exit(1);
    }
    console.log('✅ Admin user created:', data);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
