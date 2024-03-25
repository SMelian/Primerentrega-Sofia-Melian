document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.addToCartBtn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const productId = button.getAttribute('data-productid');

            try {
                const response = await fetch(`/api/cart/add/${productId}`, {
                    method: 'POST'
                });

                if (response.ok) {
                    console.log('Producto agregado al carrito');
                } else {
                    console.error('Error al agregar el producto al carrito:', response.statusText);
                }
            } catch (error) {
                console.error('Error al agregar el producto al carrito:', error);
            }
        });
    });
});
