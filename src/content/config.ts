import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const spots = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/spots" }),
    schema: ({ image }) => z.object({
        title: z.string(),
        author: z.string().optional(), // References author by slug
        address: z.string().optional(),
        neighborhood: z.string(),
        coverImage: image().optional(),
        gallery: z.array(image()).optional(),
        metrics: z.object({
            wifi_speed: z.enum(['flynet', 'reliable', 'spotty', 'detox']),
            noise_level: z.enum(['silence', 'hum', 'chaos']),
            plug_access: z.boolean(),
            coffee_price: z.number(),
            casi_score: z.number().min(1).max(10),
            coordinates: z.object({
                lat: z.number(),
                long: z.number(),
            }),
        }),
    }).transform((data) => {
        // Computed field: rentScore
        let rentScore = 'Medium';
        if (data.metrics.coffee_price < 2.00) {
            rentScore = 'High';
        } else if (data.metrics.coffee_price > 3.50) {
            rentScore = 'Low';
        }

        return {
            ...data,
            rentScore,
        };
    }),
});

const authors = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/authors" }),
    schema: ({ image }) => z.object({
        name: z.string(),
        role: z.string(),
        avatar: image(),
    }),
});

export const collections = {
    spots,
    authors,
};
