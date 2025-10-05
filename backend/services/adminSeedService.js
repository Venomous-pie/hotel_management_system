import { User } from '../models/index.js';

// Default admin credentials
const DEFAULT_ADMIN = {
  username: 'admin',
  email: 'admin@grandresort.com',
  password: 'Admin@123',  // Strong temporary password
  firstName: 'System',
  lastName: 'Administrator',
  role: 'admin',
  department: 'Management',
  phone: '+1234567890',
  isActive: true,
  createdBy: null // Self-created
};

export const seedAdminUser = async () => {
  try {
    // Check if any admin user already exists
    const existingAdmin = await User.findOne({
      where: { role: 'admin' }
    });

    if (existingAdmin) {
      console.log('✓ Admin user already exists');
      return existingAdmin;
    }

    // Check if username or email is taken
    const existingUser = await User.findOne({
      where: {
        [User.sequelize.Sequelize.Op.or]: [
          { username: DEFAULT_ADMIN.username },
          { email: DEFAULT_ADMIN.email }
        ]
      }
    });

    if (existingUser) {
      console.log('⚠️  Default admin username/email already taken');
      return null;
    }

    // Create admin user
    const adminUser = await User.create(DEFAULT_ADMIN);
    console.log('✓ Admin user created successfully');
    console.log('📋 Admin Credentials:');
    console.log(`   Username: ${DEFAULT_ADMIN.username}`);
    console.log(`   Email: ${DEFAULT_ADMIN.email}`);
    console.log(`   Password: ${DEFAULT_ADMIN.password}`);
    console.log('⚠️  Please change the password after first login!');
    
    return adminUser;

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    throw error;
  }
};

// Alternative method: Create admin with custom credentials
export const createCustomAdmin = async (adminData) => {
  try {
    const requiredFields = ['username', 'email', 'password', 'firstName', 'lastName'];
    const missingFields = requiredFields.filter(field => !adminData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Check if username or email is already taken
    const existingUser = await User.findOne({
      where: {
        [User.sequelize.Sequelize.Op.or]: [
          { username: adminData.username },
          { email: adminData.email }
        ]
      }
    });

    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    const adminUser = await User.create({
      ...adminData,
      role: 'admin',
      isActive: true,
      createdBy: null
    });

    console.log('✓ Custom admin user created successfully');
    return adminUser;

  } catch (error) {
    console.error('❌ Error creating custom admin user:', error.message);
    throw error;
  }
};