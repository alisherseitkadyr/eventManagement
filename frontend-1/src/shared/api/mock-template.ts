// frontend-1/src/shared/mocks/templatesMock.ts
import type { TemplateFull } from "../../entities/template/model/types"

export const templatesMock: TemplateFull[] = [
  {
    id: "tpl_001",
    name: "Bridal Shower Classic",
    category: "wedding",
    previewImage: "/templates/tpl_001.png",
    content: {
      backgroundImage: "../../../mockphoto/invite_001.jpeg",
      title: "Emma & James",
      subtitle: "You're Invited",
      description: "Join us for a bridal shower celebrating love and laughter.",
      date: "June 30, 2026",
      time: "11:00 AM",
      location: "Victorian Tea Room",
      address: "123 Rose Avenue, Garden District",
      gallery: [
        "../../../mockphoto/invite_001.jpeg",
        "../../../mockphoto/invite_001.jpeg",
        "../../../mockphoto/invite_001.jpeg"
      ],
      buttonText: "RSVP",
      footer: "Kindly respond by June 15"
    }
  },
  {
    id: "tpl_002",
    name: "Floral Birthday",
    category: "birthday",
    previewImage: "/templates/tpl_002.png",
    content: {
      backgroundImage: "../../../mockphoto/invite_001.jpeg",
      title: "Alex's 30th",
      subtitle: "Let's Celebrate!",
      description: "Music, drinks, and unforgettable moments.",
      date: "April 14, 2026",
      time: "7:00 PM",
      location: "Sky Lounge",
      address: "45 High Street, Downtown",
      gallery: [
        "/mockphoto/birthday1.jpg",
        "/mockphoto/birthday2.jpg"
      ],
      buttonText: "Count Me In",
      footer: "Dress to impress"
    }
  },
  {
    id: "tpl_003",
    name: "Kids Party Fun",
    category: "party",
    previewImage: "/templates/tpl_003.png",
    content: {
      backgroundImage: "../../../mockphoto/invite_001.jpeg",
      title: "Sophia's 5th Birthday",
      subtitle: "Come Play!",
      description: "Games, magic show, and lots of fun!",
      date: "May 22, 2026",
      time: "2:00 PM",
      location: "Wonderland Playground",
      address: "78 Park Lane",
      gallery: [
        "/mockphoto/kids1.jpg",
        "/mockphoto/kids2.jpg",
        "/mockphoto/kids3.jpg"
      ],
      buttonText: "Join the Fun",
      footer: "Parents welcome to stay"
    }
  }
]