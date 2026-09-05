// Team, leadership messages and careers copy.
// All text below is verbatim from https://shreerajtraders.in/our-team/
import { images } from './images';

/** Leadership messages, in the order the live page presents them. */
export const leadershipMessages = [
  {
    id: 'director',
    heading: 'Words From Director',
    body:
      "Shree Raj Traders's success is rooted in our unwavering commitment to excellence, innovation and customer satisfaction. With a dedicated workforce and cutting-edge technology, we continue to lead the Electro-Mechanical industry globally. Our goal is to provide an exceptional experience for our customers, ensuring joy and satisfaction In every Interaction.",
    name: 'Mr. Hemant Patel',
    role: 'Director',
    photo: images.team['hemant-patel']
  },
  {
    id: 'associate-partner',
    heading: 'Words From Associate Partner',
    body:
      "In today's world, innovation isn't just about technology it's about transforming challenges into opportunities. At Shree Raj Traders, we go beyond selling electrical components; we engineer solutions that power progress. We see potential where others see obstacles. With a legacy spanning six decades, Shree Raj Traders is committed to continually improving and delivering an exceptional customer experience.",
    name: 'Mr. Dharak Parikh',
    role: 'Associate Partner',
    photo: images.team['dharak-parikh']
  }
  // TODO: Kiran Parekh (General Manager) block removed pending client verification (not found on live site)
];

/** The team members listed on the Our Team page. */
export const teamMembers = [
  { name: 'Hemant Patel', role: 'Director', photo: images.team['hemant-patel'] },
  { name: 'Dharak Parikh', role: 'Associated Partner', photo: images.team['dharak-parikh'] },
  { name: 'Abhay Dave', role: 'Head Accountant', photo: images.team['abhay-dave'] },
  { name: 'Parag Parikh', role: 'Territory Manager', photo: images.team['parag-parikh'] },
  { name: 'Dixit Desai', role: 'Senior Back Office Sales', photo: images.team['dixit-desai'] },
  { name: 'Naina Mehta', role: 'Senior Back Office Sales', photo: images.team['naina-mehta'] },
  { name: 'Jayesh Yadav', role: 'Front Sales Executive', photo: images.team['jayesh-yadav'] },
  { name: 'Dinesh Padhiyar', role: 'Godown Manager', photo: images.team['dinesh-padhiyar'] },
  { name: 'Kamal Kushwah', role: 'Godown In-charge', photo: images.team['kamal-kushwah'] },
  { name: 'Krunal Soni', role: 'Inventory In-charge', photo: images.team['krunal-soni'] }
];

/** "Life @ Shree Raj Traders" careers block. */
export const careers = {
  eyebrow: 'Life @ Shree Raj Traders',
  heading: 'Careers',
  tagline: 'At the heart of every extraordinary change is a great human.',
  body:
    'Every day we are doing incredible things by working cohesively to pursue our shared purpose—to provide innovative solutions with human ingenuity. Come be a part of our exceptional team and bring your ideas, share learnings to make a difference to our expanding enterprise. To be a part of our growth story send us your CV on',
  email: 'info@shreerajtraders.in'
};
