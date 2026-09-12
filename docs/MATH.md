# Mathematics — photon

## Cosine-weighted hemisphere sampling

In an orthonormal basis $(t,b,n)$ at the hit:

$$
\begin{aligned}
\phi &= 2\pi\, u_1 \\
r &= \sqrt{u_2} \\
\omega &= r\cos\phi\, t + r\sin\phi\, b + \sqrt{1-u_2}\, n
\end{aligned}
$$

with $u_1,u_2 \sim U[0,1]$. Density $p(\omega)=\cos\theta/\pi$ on the hemisphere.

## Sphere quadratic

Ray $\mathbf{o}+t\mathbf{d}$ vs sphere center $\mathbf{c}$, radius $R$:

$$
t = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a},\quad
a=\mathbf{d}\cdot\mathbf{d},\ 
b=2\mathbf{d}\cdot(\mathbf{o}-\mathbf{c}),\ 
c=\|\mathbf{o}-\mathbf{c}\|^2 - R^2
$$

Take the smallest $t > \varepsilon$.

## Unbiasedness

With correct pdf in the estimator denominator, $\mathbb{E}[\hat{L}_o] = L_o$ (ignoring Russian roulette / clamping). Variance falls roughly as $1/N$ spp.
