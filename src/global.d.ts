declare module "*.css";
// declare module "*.module.css";
declare module "*.css" {
    const classes: { [key: string]: string };
    export default classes;
}
