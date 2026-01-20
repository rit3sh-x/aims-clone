import { createServerFn } from '@tanstack/react-start'
import { getCookies } from '@tanstack/react-start/server'

export const getSidebarState = createServerFn({ method: 'GET' })
    .handler(async () => {
        const cookies = getCookies();
        return cookies["sidebar_state"] === "true";
    })