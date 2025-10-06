import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { bookmarkedRecipes, login, myRecipes, register } from '@/routes';
import recipes from '@/routes/recipes';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bookmark, BookOpenTextIcon, BookText } from 'lucide-react';
import AppLogo from './app-logo';
import { Button } from './ui/button';

const mainNavItems: NavItem[] = [
    {
        title: 'Recipes',
        href: recipes.index(),
        icon: BookOpenTextIcon,
    },
    {
        title: 'Bookmarked',
        href: bookmarkedRecipes(),
        icon: Bookmark,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'My recipes',
        href: myRecipes(),
        icon: BookText,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={recipes.index()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                {auth.user ? (
                    <NavUser />
                ) : (
                    <>
                        <Button asChild>
                            <Link href={login()}>Log in</Link>
                        </Button>
                        <Button asChild variant={'outline'}>
                            <Link href={register()}>Register</Link>
                        </Button>
                    </>
                )}
            </SidebarFooter>
        </Sidebar>
    );
}
