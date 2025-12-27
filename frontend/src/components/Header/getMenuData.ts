import { Menu } from "@/types/Menu";
import { getTranslation } from "@/app/translations";

export const getMenuData = (): Menu[] => {
  const t = getTranslation("en");
  
  return [
    {
      id: 1,
      title: t.nav.home,
      newTab: false,
      path: "/",
    },
    {
      id: 2,
      title: t.nav.shop,
      newTab: false,
      path: "/shop-with-sidebar",
    },
    {
      id: 3,
      title: t.nav.contact,
      newTab: false,
      path: "/contact",
    },
    {
      id: 6,
      title: t.nav.pages,
      newTab: false,
      path: "/",
      submenu: [
        {
          id: 61,
          title: t.shop.title,
          newTab: false,
          path: "/shop-with-sidebar",
        },
        {
          id: 62,
          title: t.shop.title,
          newTab: false,
          path: "/shop-without-sidebar",
        },
        {
          id: 64,
          title: t.checkout.title,
          newTab: false,
          path: "/checkout",
        },
        {
          id: 65,
          title: t.cart.title,
          newTab: false,
          path: "/cart",
        },
        {
          id: 66,
          title: t.wishlist.title,
          newTab: false,
          path: "/wishlist",
        },
        {
          id: 67,
          title: t.auth.signIn,
          newTab: false,
          path: "/signin",
        },
        {
          id: 68,
          title: t.auth.signUp,
          newTab: false,
          path: "/signup",
        },
        {
          id: 69,
          title: t.account.title,
          newTab: false,
          path: "/my-account",
        },
        {
          id: 70,
          title: t.nav.contact,
          newTab: false,
          path: "/contact",
        },
        {
          id: 62,
          title: t.common.error,
          newTab: false,
          path: "/error",
        },
        {
          id: 63,
          title: "Mail Success",
          newTab: false,
          path: "/mail-success",
        },
      ],
    },
    {
      id: 7,
      title: t.nav.blog,
      newTab: false,
      path: "/",
      submenu: [
        {
          id: 71,
          title: t.blog.title,
          newTab: false,
          path: "/blogs/blog-grid-with-sidebar",
        },
        {
          id: 72,
          title: t.blog.title,
          newTab: false,
          path: "/blogs/blog-grid",
        },
        {
          id: 73,
          title: t.blog.title,
          newTab: false,
          path: "/blogs/blog-details-with-sidebar",
        },
        {
          id: 74,
          title: t.blog.title,
          newTab: false,
          path: "/blogs/blog-details",
        },
      ],
    },
  ];
};
