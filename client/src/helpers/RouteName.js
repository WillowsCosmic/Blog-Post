export const RouteIndex = '/'
export const RouteSignIn = '/sign-in'
export const RouteSignUp = '/sign-up'
export const RouteProfile = '/profile'
export const RouteCategoryDetails = '/categories'
export const RouteAddCategory = '/category/add'
export const RouteEditCategory = (category_id) => {
    return category_id 
    ? `/category/edit/${category_id}` 
    : '/category/edit/:category_id';
}
export const RouteBlog = '/blog'
export const RouteBlogAdd = '/blog/add'
export const RouteBlogEdit = (blogid) => {
    return blogid 
    ? `/blog/edit/${blogid}` 
    : '/blog/edit/:blogid';
}

export const RouteBlogDetails = (category, blog) =>{
    return !category || !blog 
    ? '/blog/:category/:blog'
    : `/blog/${category}/${blog}`
}