Rules for lexing, parsing, and transpiling

# Lexing precedence
- HTML tags
- Script
- Strings (including document "text nodes")

## Sintax examples

``` html
<htmlTag>this is a script {
  for (let i = 0 ; i < 10 ; i++){
    print `\nline ${i}`;
  }
}</htmlTag>
```

### Multiple pass lexing:

Make recursive lexing passes based on context. this will mean having multiple syntax precedence lists.