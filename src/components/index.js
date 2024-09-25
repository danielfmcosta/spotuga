export default async function loadComponents(app) {
    const components = import.meta.glob('./*.vue', { eager: true });

    for (const key of Object.keys(components)) {
        const name = key.slice(2, -4);

        app.component(name, components[key].default);   
    }
}