"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const MenuGroup_1 = __importDefault(require("./models/MenuGroup"));
const MenuMaster_1 = __importDefault(require("./models/MenuMaster"));
const RoleMaster_1 = __importDefault(require("./models/RoleMaster"));
const RolePermission_1 = __importDefault(require("./models/RolePermission"));
const AdminUser_1 = __importDefault(require("./models/AdminUser"));
const WebsiteContent_1 = require("./models/WebsiteContent");
dotenv_1.default.config();
const seedDatabase = async () => {
    try {
        console.log('[Seed] Checking database seeding requirements...');
        // 1. Seed Menu Groups
        let setupGroup = await MenuGroup_1.default.findOne({ name: 'Setup' });
        if (!setupGroup) {
            setupGroup = await MenuGroup_1.default.create({ name: 'Setup', order: 1, isActive: true });
            console.log('[Seed] Created "Setup" MenuGroup');
        }
        let cmsGroup = await MenuGroup_1.default.findOne({ name: 'CMS' });
        if (!cmsGroup) {
            cmsGroup = await MenuGroup_1.default.create({ name: 'CMS', order: 2, isActive: true });
            console.log('[Seed] Created "CMS" MenuGroup');
        }
        let websiteGroup = await MenuGroup_1.default.findOne({ name: 'Website' });
        if (!websiteGroup) {
            websiteGroup = await MenuGroup_1.default.create({ name: 'Website', order: 3, isActive: true });
            console.log('[Seed] Created "Website" MenuGroup');
        }
        // Clean up unnecessary internal developer master menus from the database
        const unusedRoutes = [
            '/admin/master/country',
            '/admin/master/state',
            '/admin/master/city',
            '/admin/master/currency',
            '/admin/master/role',
            '/admin/master/menu-group',
            '/admin/master/menu-master',
            '/admin/master/login-logs',
            '/master/country',
            '/master/state',
            '/master/city',
            '/master/currency',
            '/master/role',
            '/master/menu-group',
            '/master/menu-master',
            '/master/login-logs'
        ];
        await MenuMaster_1.default.deleteMany({ route: { $in: unusedRoutes } });
        await MenuGroup_1.default.deleteOne({ name: 'Master' });
        // Prepend /admin to all existing menus in database
        const existingDbMenus = await MenuMaster_1.default.find();
        for (const m of existingDbMenus) {
            if (!m.route.startsWith('/admin')) {
                m.route = `/admin${m.route}`;
                await m.save();
                console.log(`[Seed] Migrated existing database menu route to: ${m.route}`);
            }
        }
        // 2. Seed Menu Items
        const menuItems = [
            // Setup Group
            { label: 'Admin Users', icon: 'Users', route: '/admin/setup/admin-users', menuGroupId: setupGroup._id, order: 1 },
            { label: 'User Roles', icon: 'ShieldAlert', route: '/admin/setup/user-roles', menuGroupId: setupGroup._id, order: 2 },
            // CMS Group
            { label: 'Email Setup', icon: 'Settings', route: '/admin/cms/email-setup', menuGroupId: cmsGroup._id, order: 1 },
            { label: 'Email For', icon: 'Mail', route: '/admin/cms/email-for', menuGroupId: cmsGroup._id, order: 2 },
            { label: 'Email Template', icon: 'FileText', route: '/admin/cms/email-template', menuGroupId: cmsGroup._id, order: 3 },
            // Website Group
            // Visual editor first — it is the entry point for non-developers.
            { label: 'Website Editor', icon: 'LayoutTemplate', route: '/admin/website/editor', menuGroupId: websiteGroup._id, order: 0 },
            { label: 'Products', icon: 'Database', route: '/admin/master/product', menuGroupId: websiteGroup._id, order: 1 },
            { label: 'Categories', icon: 'FolderOpen', route: '/admin/master/category', menuGroupId: websiteGroup._id, order: 2 },
            { label: 'Testimonials', icon: 'MessageSquare', route: '/admin/master/testimonial', menuGroupId: websiteGroup._id, order: 3 },
            { label: 'FAQs', icon: 'HelpCircle', route: '/admin/master/faq', menuGroupId: websiteGroup._id, order: 4 },
            { label: 'Blogs', icon: 'BookOpen', route: '/admin/master/blog', menuGroupId: websiteGroup._id, order: 5 },
            { label: 'Inquiries (RFQs)', icon: 'MailCheck', route: '/admin/master/inquiry', menuGroupId: websiteGroup._id, order: 6 },
            // Careers — the /career/ page is unlisted on the website, but it is managed here like any other content.
            { label: 'Job Openings', icon: 'Briefcase', route: '/admin/master/job-opening', menuGroupId: websiteGroup._id, order: 7 },
            { label: 'Job Applications', icon: 'UserCheck', route: '/admin/master/job-application', menuGroupId: websiteGroup._id, order: 8 }
        ];
        const seededMenus = [];
        for (const item of menuItems) {
            let menu = await MenuMaster_1.default.findOne({ route: item.route });
            if (!menu) {
                menu = await MenuMaster_1.default.create({
                    ...item,
                    isActive: true,
                    parentId: null
                });
                console.log(`[Seed] Created Menu item: ${item.label}`);
            }
            seededMenus.push(menu);
        }
        // 3. Seed Roles
        let superAdminRole = await RoleMaster_1.default.findOne({ name: 'Super Admin' });
        if (!superAdminRole) {
            superAdminRole = await RoleMaster_1.default.create({
                name: 'Super Admin',
                description: 'Super Administrator with full access',
                isActive: true
            });
            console.log('[Seed] Created "Super Admin" Role');
        }
        let editorRole = await RoleMaster_1.default.findOne({ name: 'Editor' });
        if (!editorRole) {
            editorRole = await RoleMaster_1.default.create({
                name: 'Editor',
                description: 'Editor with read/write access to CMS and Masters',
                isActive: true
            });
            console.log('[Seed] Created "Editor" Role');
        }
        let viewerRole = await RoleMaster_1.default.findOne({ name: 'Viewer' });
        if (!viewerRole) {
            viewerRole = await RoleMaster_1.default.create({
                name: 'Viewer',
                description: 'Viewer with read-only access',
                isActive: true
            });
            console.log('[Seed] Created "Viewer" Role');
        }
        // 4. Seed Role Permissions
        let superAdminPerms = await RolePermission_1.default.findOne({ roleId: superAdminRole._id });
        if (!superAdminPerms) {
            superAdminPerms = new RolePermission_1.default({
                roleId: superAdminRole._id,
                permissions: []
            });
        }
        const existingPermsMap = new Map(superAdminPerms.permissions.map((p) => [p.menuId.toString(), p]));
        let updatedPerms = false;
        for (const m of seededMenus) {
            if (!existingPermsMap.has(m._id.toString())) {
                superAdminPerms.permissions.push({
                    menuId: m._id,
                    canView: true,
                    canCreate: true,
                    canEdit: true,
                    canDelete: true
                });
                updatedPerms = true;
            }
        }
        if (updatedPerms || superAdminPerms.isNew) {
            await superAdminPerms.save();
            console.log('[Seed] Synchronized all permissions for "Super Admin" Role');
        }
        // Viewer and Editor are synchronised the same way as Super Admin: new menus
        // are appended, existing entries are never overwritten, so any permission an
        // administrator has revoked by hand stays revoked.
        const syncRolePermissions = async (roleId, roleLabel, grant) => {
            let rolePerms = await RolePermission_1.default.findOne({ roleId });
            if (!rolePerms) {
                rolePerms = new RolePermission_1.default({ roleId, permissions: [] });
            }
            const known = new Set(rolePerms.permissions.map((p) => p.menuId.toString()));
            let changed = false;
            for (const m of seededMenus) {
                if (!known.has(m._id.toString())) {
                    rolePerms.permissions.push({ menuId: m._id, ...grant });
                    changed = true;
                }
            }
            if (changed || rolePerms.isNew) {
                await rolePerms.save();
                console.log(`[Seed] Synchronized permissions for "${roleLabel}" Role`);
            }
        };
        await syncRolePermissions(viewerRole._id, 'Viewer', {
            canView: true,
            canCreate: false,
            canEdit: false,
            canDelete: false
        });
        // Editors are the non-developer staff the Website Editor exists for: they can
        // read and change content, but not delete records.
        await syncRolePermissions(editorRole._id, 'Editor', {
            canView: true,
            canCreate: true,
            canEdit: true,
            canDelete: false
        });
        // 5. Seed Initial Admin User
        let adminUser = await AdminUser_1.default.findOne({ email: 'admin@shreeraj.com' });
        if (!adminUser) {
            adminUser = new AdminUser_1.default({
                name: 'Super Admin',
                email: 'admin@shreeraj.com',
                password: 'admin123', // Will be pre-save hashed
                mobile: '1234567890',
                roleId: superAdminRole._id,
                isActive: true
            });
            await adminUser.save();
            console.log('[Seed] Seeding completed: Created default Super Admin user (admin@shreeraj.com / admin123)');
        }
        // 6. Seed Categories
        const categoryCount = await WebsiteContent_1.Category.countDocuments();
        if (categoryCount === 0) {
            await WebsiteContent_1.Category.create([
                {
                    id: "switchgears",
                    title: "Switchgears",
                    badge: "Siemens LV Distribution",
                    description: "Siemens low voltage switchgears, control products, miniature circuit breakers and the Sinnova protection range.",
                    imageKey: "cat-switchgears",
                    isActive: true
                },
                {
                    id: "motors",
                    title: "Motors",
                    badge: "Siemens, CGL & Hindustan Motors",
                    description: "Three-phase induction motors from Siemens, CGL (Crompton Greaves) and Hindustan Electric Motors.",
                    imageKey: "cat-motors",
                    isActive: true
                },
                {
                    id: "frp-gratings",
                    title: "FRP Gratings",
                    badge: "Corrosion Resistant & Lightweight",
                    description: "Composite gratings of resin and fiberglass — corrosion resistant, lightweight, with a high strength-to-weight ratio.",
                    imageKey: "cat-frp-gratings",
                    isActive: true
                },
                {
                    id: "frp-cable-trays",
                    title: "FRP Cable Tray",
                    badge: "Non-Corrosive Cable Support",
                    description: "FRP ladder type and perforated cable trays — self-pigmented, fire-retardant, UV-stabilized and fully customizable.",
                    imageKey: "cat-frp-cable-tray",
                    isActive: true
                }
            ]);
            console.log('[Seed] Seeded default website Categories');
        }
        // 7. Seed Products
        const productCount = await WebsiteContent_1.Product.countDocuments();
        if (productCount === 0) {
            await WebsiteContent_1.Product.create([
                {
                    slug: "siemens-switchgear-low-voltage-power-distribution-product",
                    name: "SIEMENS Switchgear Low Voltage Power Distribution Product",
                    brand: "Siemens",
                    categoryId: "switchgears",
                    imageKey: "siemens-switchgear-lv-power-distribution",
                    longDescription: "Run your electrical systems more efficiently and safely using our high-quality Electrical Control Products. Our electrically controlled switches—Contactors—supplement the need for control over an electric motor or some other sort of high power load, available in sizes S00 to S12 with operational currents from 7A to 500A. Innovative SIEMENS switchgear switching devices, also called relays and solid-state switches, opening or closing electrical circuits, are available in all sizes from S6 to S12, having a power rating ranging from 22 kW to 250 kW.",
                    applications: "Direct-On-Line Starters, Motor Control Centers, Industrial Control Panels",
                    specs: [],
                    liveSpecs: [
                        "Contactors: Size: S00 to S12, Operational current: 7A to 500A",
                        "Switching Device: Size: S6 to S12, 22 kW to 250 kW"
                    ],
                    attributes: {
                        "productType": "Contactors",
                        "frameSize": "Size S00 to S12",
                        "operationalCurrent": "7A to 500A"
                    },
                    isActive: true
                },
                {
                    slug: "low-voltage-control-product",
                    name: "Low Voltage Control Product",
                    brand: "Siemens",
                    categoryId: "switchgears",
                    imageKey: "low-voltage-control-product",
                    longDescription: "Explore our professional range of Low Voltage Control Products, designed to enable maximum safety and efficiency in your electrical systems. Our MCCBs provide outstanding protection for low-voltage systems by safeguarding against damage due to overload and short circuits. The rated currents of the MCCBs vary from 16 A to 1250 A, while their breaking capacities are from 16 kA to 55 kA. They are versatile and reliable; the trip units are available in thermal magnetic and microprocessor-based forms.",
                    applications: "Main Power Distribution Boards, Industrial Protection Panels",
                    specs: [],
                    liveSpecs: [
                        "MCCB: Rated current: 16A to 1250A, Breaking capacity: 16KA to 55KA",
                        "ACB: Rated current: 630A to 6300A, Short circuit breaking capacity: 150KA, Rated up to 55°C",
                        "Control Switch: Frame size: 100 to 630A"
                    ],
                    attributes: {
                        "productType": "MCCB",
                        "ratedCurrent": "16A to 1250A",
                        "breakingCapacity": "16 kA to 55 kA"
                    },
                    isActive: true
                },
                {
                    slug: "mcb",
                    name: "MCB",
                    brand: "Siemens",
                    categoryId: "switchgears",
                    imageKey: "mcb",
                    longDescription: "Our MCBs are designed to meet IS/IEC 60898-1 for reliable circuit protection. They are intended for use in 240/415V and 50-60 Hz systems and have an ISI marking. They come rated in currents from 0.5A to 63A with pole configurations 1, 2, 3, and 4 for high breaking capacity, ensuring safety and efficiency. Moreover, they comply with RoHS standards, hence meeting very strict environmental and safety regulations, and thus protecting your electrical systems.",
                    applications: "Residential, Commercial & Industrial Distribution Boards",
                    specs: [],
                    liveSpecs: [
                        "Standards: IS/IEC 60898-1",
                        "Voltage: 240/415V",
                        "Frequency: 50-60Hz, ISI marking: CM/L no. 2255548",
                        "Rated current: 0.5A to 63A, 1, 2, 3, 4 pole available"
                    ],
                    attributes: {
                        "standards": "IS/IEC 60898-1",
                        "voltage": "240/415V",
                        "frequency": "50-60Hz",
                        "isiMarking": "CM/L No. 2255548",
                        "ratedCurrent": "0.5A to 63A",
                        "poles": "1, 2, 3, 4 pole"
                    },
                    isActive: true
                },
                {
                    slug: "sinnova",
                    name: "Sinnova",
                    brand: "Siemens",
                    categoryId: "switchgears",
                    imageKey: "sinnova",
                    longDescription: "Sinnova has a complete range of electrical protection solutions for the safety and efficiency of your electrical systems. Our MCCBs, or Molded Case Circuit Breakers, give maximum circuit protection for low voltage systems. Rated currents are from 16A to 630A, and breaking capacities are from 10KA to 55KA. They are available in 1, 2, 3, and 4 pole configurations with thermal magnetic-based trip units for added reliability.",
                    applications: "Control Panels, Machinery Enclosures, Power Distribution Systems",
                    specs: [],
                    liveSpecs: [
                        "Provides circuit protection for low voltage systems: Rated current: 16A to 630A, Breaking capacity: 10KA to 55KA",
                        "ACB (Air Circuit Breaker): Rated current: 800A to 4000A, Breaking capacity: 55KA, Conforms to IEC 60947-2",
                        "Fuses: Range: 6A to 100A, 50°C ambient temperature",
                        "Load Break Switches",
                        "Control Switches",
                        "Energy Management Systems"
                    ],
                    attributes: {
                        "ratedCurrent": "16A to 630A",
                        "breakingCapacity": "10 kA to 55 kA"
                    },
                    isActive: true
                },
                {
                    slug: "siemens-motor",
                    name: "Siemens Motor",
                    brand: "Siemens",
                    categoryId: "motors",
                    imageKey: "siemens-motor",
                    longDescription: "Shree Raj offers Siemens Motors, designed with exceptional performance and durability for any industrial application. They have protection ratings IP55, IP56, and IP65, thus assuring reliability even in hostile environments. Its cast iron case, cooling type IC411, guarantees that these motors run within the optimum temperature range. It also features a voltage rating of 415 V while supporting both 50 Hz and 60 Hz. They come with 2, 4, 6, and 8 poles, applied according to operational needs, and they have types of duties like S1 and S4. The standards of IS:12615 and IEC 60034-1 are complied, assuring quality performance. Foot, flange, and foot-cum-flange mounting types are permitted, and they are available with output power ranging from 0.5 HP to 425 HP with IE2, IE3, and IE4 efficiency classes to enhance energy savings and cost efficiency.",
                    applications: "Pumps, Compressors, Fans, Blowers, Crushers, Conveyors",
                    specs: [],
                    liveSpecs: [
                        "Degree of Protection: IP55, IP56, IP65",
                        "Housing Material: Cast Iron",
                        "Cooling Method: IC411",
                        "Voltage: 415 V",
                        "Frequency: 50 Hz, 60 Hz",
                        "Number of Poles: 2, 4, 6, 8",
                        "Duty Types: S1, S4",
                        "Standards: IS:12615, IEC 60034-1",
                        "Mounting Options: Foot, Flange, Foot cum Flange",
                        "Output Power: 0.5 HP to 425 HP",
                        "Efficiency Classes: IE2, IE3, IE4"
                    ],
                    attributes: {
                        "degreeOfProtection": "IP55, IP56, IP65",
                        "housingMaterial": "Cast Iron",
                        "coolingMethod": "IC411",
                        "voltage": "415 V",
                        "frequency": "50 Hz, 60 Hz",
                        "poles": "2, 4, 6, 8",
                        "dutyTypes": "S1, S4",
                        "standards": "IS:12615, IEC 60034-1",
                        "mounting": "Foot, Flange, Foot cum Flange",
                        "outputPower": "0.5 HP to 425 HP",
                        "efficiencyClasses": "IE2, IE3, IE4"
                    },
                    isActive: true
                },
                {
                    slug: "crompton-greaves-motor",
                    name: "Crompton Greaves Motor",
                    brand: "CGL (Crompton Greaves)",
                    categoryId: "motors",
                    imageKey: "crompton-greaves-motor",
                    longDescription: "Shree Raj offers Crompton motors, constructed for assured performance under strenuous industrial conditions. Degrees of protection, IP55, IP56, and IP65, protect these motors against environmental hazards. The casing is made from cast iron, applying the IC411 cooling method for strength and efficient dissipation of heat. Crompton motors are designed to work in a voltage of 415 V and support 50 Hz and 60 Hz. They have varying pole configurations, namely 2, 4, 6, and 8. The duty types applied to them include S1 and S4. The quality standards given are IS:12615 and IEC 60034-1. Foot, flange, and foot cum flange mounting are mounting options. Its output power ranges from 0.5 HP to 425 HP, making them quite cost-effective in their use classes IE2, IE3, and IE4.",
                    applications: "Pumps, Fan Drives, Chemical Machinery, General Industrial Duty",
                    specs: [],
                    liveSpecs: [
                        "Degree of Protection: IP55, IP56, IP65",
                        "Housing Material: Cast Iron",
                        "Cooling Method: IC411",
                        "Voltage: 415 V",
                        "Frequency: 50 Hz, 60 Hz",
                        "Number of Poles: 2, 4, 6, 8",
                        "Duty Types: S1, S4",
                        "Standards: IS:12615, IEC 60034-1",
                        "Mounting Options: Foot, Flange, Foot cum Flange",
                        "Output Power: 0.5 HP to 425 HP",
                        "Efficiency Classes: IE2, IE3, IE4"
                    ],
                    attributes: {
                        "degreeOfProtection": "IP55, IP56, IP65",
                        "housingMaterial": "Cast Iron",
                        "coolingMethod": "IC411",
                        "voltage": "415 V",
                        "frequency": "50 Hz, 60 Hz",
                        "poles": "2, 4, 6, 8",
                        "dutyTypes": "S1, S4",
                        "standards": "IS:12615, IEC 60034-1",
                        "mounting": "Foot, Flange, Foot cum Flange",
                        "outputPower": "0.5 HP to 425 HP",
                        "efficiencyClasses": "IE2, IE3, IE4"
                    },
                    isActive: true
                },
                {
                    slug: "hindustan-electric-motor",
                    name: "Hindustan Electric Motor",
                    brand: "Hindustan Electric",
                    categoryId: "motors",
                    imageKey: "hindustan-electric-motor",
                    longDescription: "HEM motors by Shree Raj are built for robust performance in industries. IP55, IP56, IP65 protection degrees with a cast iron housing make them tough and rugged against rough conditions, while IC411 cooling maintains efficiency due to the motor’s capability to remain within optimal temperature limits. They can work at 415 V with variable frequencies of either 50 Hz or 60 Hz for their flexible applications. They are available in configurations such as 2, 4, 6, and 8-pole ones. Along with this are the mentions of the supported Duty types, which are S1 and S4, whose standards are IS:12615 and IEC 60034-1 respectively. They are mounted in a variety of mounting options for application versatility such as foot, flange, and foot-cum-flange mounting. With an Output Power ranging from 0.5 HP to 425 HP, with efficiency classes IE2, IE3, and IE4, it makes sure that it has high performance and energy efficiency.",
                    applications: "Textile Mills, Cement Works, Steel Rolling Mills, Paper Mills",
                    specs: [],
                    liveSpecs: [
                        "Degree of Protection: IP55, IP56, IP65",
                        "Housing Material: Cast Iron",
                        "Cooling Method: IC411",
                        "Voltage: 415 V",
                        "Frequency: 50 Hz, 60 Hz",
                        "Number of Poles: 2, 4, 6, 8",
                        "Duty Types: S1, S4",
                        "Standards: IS:12615, IEC 60034-1",
                        "Mounting Options: Foot, Flange, Foot cum Flange",
                        "Output Power: 0.5 HP to 425 HP",
                        "Efficiency Classes: IE2, IE3, IE4"
                    ],
                    attributes: {
                        "degreeOfProtection": "IP55, IP56, IP65",
                        "housingMaterial": "Cast Iron",
                        "coolingMethod": "IC411",
                        "voltage": "415 V",
                        "frequency": "50 Hz, 60 Hz",
                        "poles": "2, 4, 6, 8",
                        "dutyTypes": "S1, S4",
                        "standards": "IS:12615, IEC 60034-1",
                        "mounting": "Foot, Flange, Foot cum Flange",
                        "outputPower": "0.5 HP to 425 HP",
                        "efficiencyClasses": "IE2, IE3, IE4"
                    },
                    isActive: true
                },
                {
                    slug: "meniscus-top",
                    name: "Meniscus Top",
                    brand: "Shree Raj Traders",
                    categoryId: "frp-gratings",
                    imageKey: "cat-frp-gratings",
                    longDescription: "The Meniscus Top FRP Grating is manufactured at Shree Raj through composite materials made of resin and fiberglass to provide additional strength and durability. This tray is available in a 3838 mesh with heights of 25 mm, 30 mm, and 38 mm, whereby its meniscus top surface makes for a non-slip and hence adds to safety. They have perfect applications in industries and commercial purposes alike. These are highly resistant to corrosion and hence can be suitably applied in very harsh conditions with low maintenance costs. They are lightweight and, hence easier to handle and install compared to traditional metal grating. The lightweight feature means reduced installation costs and labor. With a high strength-to-weight ratio, these trays ensure that the equipment has high load-bearing capability while being very light in weight, hence making them suitable for heavy-duty applications in walkways, platforms, chemical plants, food processing facilities, and a myriad of other industries that focus on heavy-duty performance.",
                    applications: "Industrial Walkways, Platforms, Wastewater Treatment Plants",
                    specs: [],
                    liveSpecs: [],
                    attributes: {
                        "mesh": "3838",
                        "heights": "25 mm, 30 mm, 38 mm",
                        "surfaceFinish": "Meniscus non-slip top surface",
                        "construction": "Composite of resin + fiberglass"
                    },
                    isActive: true
                },
                {
                    slug: "grit-top",
                    name: "Grit Top",
                    brand: "Shree Raj Traders",
                    categoryId: "frp-gratings",
                    imageKey: "grit-top",
                    longDescription: "Our Grit Top FRP Grating is available at Shree Raj and is made of resin and fiberglass composite material for improved strength and durability. It has a 3838 mesh with heights of 25 mm, 30 mm, and 38 mm. With its grit top finish, it gives a highly abrasive, non-slip surface for maximum safety, making it very suitable for high-traffic/hazardous areas. Corrosion-resistant with low maintenance, this tray is suitable for harsh environments. It is lightweight; handling and installation are easier, reducing installation costs and labor. With its high strength-to-weight ratio, it gives outstanding load-carrying capacity for heavy-duty applications in walkways, platforms, chemical plants, food processing facilities, etc.",
                    applications: "Industrial Walkways, Platforms, Process Areas",
                    specs: [],
                    liveSpecs: [],
                    attributes: {
                        "mesh": "3838",
                        "heights": "25 mm, 30 mm, 38 mm",
                        "surfaceFinish": "Grit non-slip top surface",
                        "construction": "Composite of resin + fiberglass"
                    },
                    isActive: true
                },
                {
                    slug: "cheker-plate",
                    name: "Checkered Plate",
                    brand: "Shree Raj Traders",
                    categoryId: "frp-gratings",
                    imageKey: "cheker-plate",
                    longDescription: "The Checkered Plate FRP Grating has been introduced by Shree Raj, made of solid resin plus fiberglass matrix. Inherent benefits for building strong, resilient, and corrosion-resistant trays for working in high-traffic and hazardous areas, lightweight, and low maintenance, make them ideal for various industrial applications. Ltd. is manufactured with a composite material consisting of resin and fiberglass. It has a height of 5 mm and provides outstanding strength and durability. The top surface has a grit finish that ensures ultra-abrasiveness and non-slip surface to provide maximum safety in high traffic and hazardous areas. These trays offer excellent resistance to corrosion and are perfect for demanding environments with low maintenance needs. Besides, it is lightweight, thus offering less installation cost and labor.",
                    applications: "Trench Covers, Covered Platforms, Process Areas",
                    specs: [],
                    liveSpecs: [],
                    attributes: {
                        "surfaceFinish": "Grit finish, non-slip solid plate",
                        "heights": "5 mm",
                        "construction": "Composite of resin + fiberglass"
                    },
                    isActive: true
                },
                {
                    slug: "ladder-type-cable-tray",
                    name: "Ladder Type Cable Tray",
                    brand: "Shree Raj Traders",
                    categoryId: "frp-cable-trays",
                    imageKey: "ladder-type-cable-tray",
                    longDescription: "Our Ladder Type FRP Cable Trays come with a design that allows them to support heavy-weight cables, blending strength and durability with UV protection. The trays are very light in weight, thus making their installation and replacement easy exercises. As these are self-pigmented, painting is not required. They are fire-retardant and UV-stabilized for long-lasting service in difficult conditions. Innumerable options in customization are available to suit requirements, thus making them an ideal application for industries.",
                    applications: "Substations, Power Plants, Chemical Plants, Coastal Projects",
                    specs: [
                        "Heavy cable load support",
                        "Self-pigmented (no painting required)",
                        "Fire-retardant",
                        "UV-stabilized",
                        "Fully customizable"
                    ],
                    liveSpecs: [],
                    attributes: {},
                    isActive: true
                },
                {
                    slug: "perforated-cable-tray",
                    name: "Perforated Cable Tray",
                    brand: "Shree Raj Traders",
                    categoryId: "frp-cable-trays",
                    imageKey: "perforated-cable-tray",
                    longDescription: "Our Perforated FRP Cable Trays are light in weight, having exceptional strength, durability, protection from UV, and ideal for light-weight cable support. Such trays are lightweight, easy to install, or replace. Self-pigmentation eliminates painting; besides, it is fire retardant and UV stabilized for its reliability in various conditions. The options for customization make these trays suitable in a vast range of applications due to their strong performance and easy maintenance.",
                    applications: "Instrumentation Wiring, Control Room Cables, Solar Power Plants",
                    specs: [
                        "Light-weight cable support",
                        "Self-pigmented (no painting required)",
                        "Fire-retardant",
                        "UV-stabilized",
                        "Fully customizable"
                    ],
                    liveSpecs: [],
                    attributes: {},
                    isActive: true
                }
            ]);
            console.log('[Seed] Seeded default website Products');
        }
        // 8. Seed Testimonials
        const testimonialCount = await WebsiteContent_1.Testimonial.countDocuments();
        if (testimonialCount === 0) {
            await WebsiteContent_1.Testimonial.create([
                {
                    client: "Mukesh Dobariya",
                    company: "HI-MAKE",
                    feedback: "We received exceptional value for money on Siemens switchgear, along with valuable technical assistance in selecting the right products for our requirements.",
                    isActive: true
                },
                {
                    client: "Rakesh Gaveriya",
                    company: "Mech Tech Machine Pvt Ltd",
                    feedback: "A reliable partner for Crompton Greaves induction motors. They are responsive, deliver promptly, and have consistently helped us meet our project deadlines.",
                    isActive: true
                },
                {
                    client: "Abhay",
                    company: "Spectom",
                    feedback: "Their knowledge of Siemens, Crompton Greaves and Hindustan induction motors is unmatched. Application expertise plays an important role in deciding which motor should be used in the production machines and not just as an electrical item.",
                    isActive: true
                }
            ]);
            console.log('[Seed] Seeded website Testimonials');
        }
        // 9. Seed FAQs
        const faqCount = await WebsiteContent_1.FAQ.countDocuments();
        if (faqCount === 0) {
            await WebsiteContent_1.FAQ.create([
                {
                    question: "Are you an authorized distributor for all these brands?",
                    answer: "Yes! Shree Raj Traders is an Authorized Channel Partner for Siemens low-voltage switchgears, CGL (Crompton Greaves) motors, and Hindustan Electric Motors, ensuring 100% genuine products with manufacturer warranties.",
                    order: 1,
                    isActive: true
                },
                {
                    question: "Do you supply switchgears and motors outside Ahmedabad?",
                    answer: "Yes, we distribute electrical and composite products to industrial hubs all across Gujarat and major industrial estates nationwide.",
                    order: 2,
                    isActive: true
                },
                {
                    question: "Can we request custom sizes for FRP cable trays and gratings?",
                    answer: "Yes! We specialize in custom-tailored FRP solutions including fire-retardant and UV-stabilized dimensions manufactured to match client engineering layouts.",
                    order: 3,
                    isActive: true
                }
            ]);
            console.log('[Seed] Seeded website FAQs');
        }
        // 10. Seed Blogs
        const blogCount = await WebsiteContent_1.Blog.countDocuments();
        if (blogCount === 0) {
            await WebsiteContent_1.Blog.create([
                {
                    title: "When Should You Replace Industrial Switchgear? 7 Warning Signs",
                    slug: "when-to-replace-industrial-switchgear",
                    excerpt: "Replacement of industrial switchgear is required in case of aging of switchgear, repeated breakdown, overheating of switchgear, poor performance in terms of protection, and when the switchgear fails to provide adequate supply to your industrial requirements.",
                    content: "<p>Replacement of industrial switchgear is required in case of aging of switchgear, repeated breakdown, overheating of switchgear, poor performance in terms of protection, and when the switchgear fails to provide adequate supply to your industrial requirements. If you ignore the above factors, the chances of downtime and equipment failure would increase.</p>",
                    author: "Super Admin",
                    date: "2026-08-06",
                    readTime: "5 min read",
                    imageKey: "when-to-replace-industrial-switchgear",
                    tags: ["Switchgears", "Maintenance", "Siemens"],
                    isActive: true
                },
                {
                    title: "Why Buy Siemens Motors from an Authorized Dealer in Ahmedabad?",
                    slug: "why-buy-siemens-motors-authorized-dealer",
                    excerpt: "Purchasing industrial electric motors requires careful evaluation of authenticity, warranty terms, and dynamic load compatibility. Read on to learn why sourcing from an authorized partner in Gujarat guarantees operational safety.",
                    content: "<p>Purchasing industrial electric motors requires careful evaluation of authenticity, warranty terms, and dynamic load compatibility. Sourcing from an authorized partner in Gujarat guarantees operational safety. Shree Raj Traders has been a trusted supplier for 60+ years, providing complete customer support from sizing selection to actual field commissioning.</p>",
                    author: "Super Admin",
                    date: "2026-08-10",
                    readTime: "4 min read",
                    imageKey: "siemens-motors-authorized-dealer-ahmedabad",
                    tags: ["Motors", "Siemens", "Ahmedabad"],
                    isActive: true
                }
            ]);
            console.log('[Seed] Seeded website Blogs');
        }
        console.log('[Seed] Database seeding check completed successfully.');
    }
    catch (error) {
        console.error('[Seed] Database seeding failed:', error);
    }
};
exports.seedDatabase = seedDatabase;
// Executable standalone seed script if called directly
if (require.main === module) {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shreeraj-admin';
    mongoose_1.default.connect(mongoUri)
        .then(async () => {
        await (0, exports.seedDatabase)();
        await mongoose_1.default.disconnect();
        console.log('[Seed] Standalone seed run successfully completed.');
        process.exit(0);
    })
        .catch((err) => {
        console.error('[Seed] Standalone seed connection failed:', err);
        process.exit(1);
    });
}
