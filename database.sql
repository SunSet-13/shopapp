-- Đặt tên là duy nhất
ALTER TABLE products
ADD CONSTRAINT unique_name UNIQUE (name);

-- Đặt giá trị mặc định = 0 và đảm bảo >= 0 cho các trường số
ALTER TABLE products
MODIFY price INT(11) NOT NULL DEFAULT 0;

ALTER TABLE products
MODIFY oldprice INT(11) DEFAULT 0;

ALTER TABLE products
MODIFY quantity INT(11) DEFAULT 0;

ALTER TABLE products
MODIFY buyturn INT(11) DEFAULT 0;
