import { config, fields, collection } from '@keystatic/core';

export default config({
    storage: {
        kind: 'local',
    },
    collections: {
        spots: collection({
            label: 'Spots',
            slugField: 'slug',
            path: 'src/content/spots/*',
            format: { contentField: 'content' },
            schema: {
                slug: fields.slug({ name: { label: 'Slug (Neighborhood-Name)' } }),
                title: fields.text({ label: 'Venue Name' }),
                author: fields.relationship({
                    label: 'Author',
                    collection: 'authors',
                }),
                address: fields.text({ label: 'Address' }),
                neighborhood: fields.text({ label: 'Neighborhood' }),
                coverImage: fields.image({
                    label: 'Cover Image (3:2)',
                    directory: 'src/assets/spots',
                    publicPath: '@assets/spots',
                }),
                gallery: fields.array(
                    fields.image({
                        label: 'Evidence Photo',
                        directory: 'src/assets/spots/gallery',
                        publicPath: '@assets/spots/gallery',
                    }),
                    { label: 'Evidence Gallery' }
                ),
                metrics: fields.object({
                    wifi_speed: fields.select({
                        label: 'Wifi Speed',
                        options: [
                            { label: 'Flynet (50mb+)', value: 'flynet' },
                            { label: 'Reliable', value: 'reliable' },
                            { label: 'Spotty', value: 'spotty' },
                            { label: 'Digital Detox', value: 'detox' },
                        ],
                        defaultValue: 'reliable',
                    }),
                    noise_level: fields.select({
                        label: 'Noise Level',
                        options: [
                            { label: 'Library Silence', value: 'silence' },
                            { label: 'Cafe Hum', value: 'hum' },
                            { label: 'Bar Chaos', value: 'chaos' },
                        ],
                        defaultValue: 'hum',
                    }),
                    plug_access: fields.checkbox({ label: 'Plug Access', defaultValue: true }),
                    coffee_price: fields.number({
                        label: 'Price of Café con Leche (€)',
                        validation: { min: 0 },
                        defaultValue: 2.5,
                    }),
                    casi_score: fields.number({
                        label: 'Casi Score (1-10)',
                        validation: { min: 1, max: 10 },
                        defaultValue: 7,
                    }),
                    coordinates: fields.object({
                        lat: fields.number({ label: 'Latitude' }),
                        long: fields.number({ label: 'Longitude' }),
                    }),
                }),
                content: fields.mdx({ label: 'Content' }),
            },
        }),
        authors: collection({
            label: 'Authors',
            slugField: 'name',
            path: 'src/content/authors/*',
            format: { contentField: 'bio' },
            schema: {
                name: fields.slug({ name: { label: 'Name' } }),
                role: fields.text({ label: 'Role' }),
                avatar: fields.image({
                    label: 'Avatar',
                    directory: 'src/assets/authors',
                    publicPath: '@assets/authors',
                }),
                bio: fields.mdx({ label: 'Bio' }),
            },
        }),
    },
});
