// Ajusta o blogPost ao modelo definido para /words:
// - uma categoria por post (o modelo inicial permitia várias)
// - tags livres e localizadas
//
// Seguro de rodar: o espaço não tinha nenhuma entrada de blogPost quando esta
// migration foi escrita. `deleteField` omite, publica e então apaga o campo,
// o que descarta o conteúdo associado.

module.exports = function (migration) {
  const blogPost = migration.editContentType("blogPost");

  blogPost.deleteField("categories");

  blogPost
    .createField("category")
    .name("Category")
    .type("Link")
    .linkType("Entry")
    .required(false)
    .validations([{ linkContentType: ["blogCategory"] }]);

  blogPost
    .createField("tags")
    .name("Tags")
    .type("Array")
    .localized(true)
    .items({ type: "Symbol" });
};
